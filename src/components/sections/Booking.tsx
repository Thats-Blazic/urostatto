"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  CalendarDays,
  Check,
  CircleAlert,
  CircleCheck,
  ChevronDown,
  Copy,
  ImagePlus,
  Info,
  LoaderCircle,
  MessageCircle,
  MessageSquare,
  MessagesSquare,
  Phone,
  Send,
  Trash2,
  TriangleAlert,
} from "lucide-react";
import {
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
  type DragEvent,
  type FormEvent,
  type ReactNode,
} from "react";
import { useSiteState } from "@/components/providers";
import { Button } from "@/components/ui/Button";
import { InstagramIcon } from "@/components/ui/icons";
import { Reveal } from "@/components/ui/Reveal";
import { SectionLabel } from "@/components/ui/SectionLabel";
import {
  bodyPartOptions,
  bookingProcess,
  fieldLimits,
  referenceFileRules,
  sizeOptions,
  styleOptions,
} from "@/config/booking";
import { contact } from "@/config/site";
import { cn } from "@/lib/cn";
import { useClientValue } from "@/lib/hooks";
import { buildBookingMessage, buildMessageLinks } from "@/lib/booking/message";
import {
  bookingFields,
  emptyBookingValues,
  todayISO,
  validateBooking,
  validateField,
  type BookingErrors,
  type BookingField,
  type BookingValues,
} from "@/lib/booking/validation";

type Status = "idle" | "submitting" | "success" | "unavailable" | "error";

const inputBase =
  "w-full border-0 border-b bg-transparent py-3 text-base text-bone placeholder:text-ash/50 transition-colors duration-300 focus:outline-none";
const inputState = (hasError: boolean) =>
  hasError
    ? "border-blood"
    : "border-white/20 hover:border-white/40 focus:border-blood focus:shadow-[0_1px_0_0_var(--color-blood)]";

function formatSize(bytes: number) {
  if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

interface FieldProps {
  id: string;
  label: string;
  optional?: boolean;
  error?: string;
  className?: string;
  children: ReactNode;
}

function Field({ id, label, optional, error, className, children }: FieldProps) {
  return (
    <div className={className}>
      <label htmlFor={id} className="mb-1 block text-[0.7rem] font-semibold uppercase tracking-[0.25em] text-ash">
        {label}
        {optional && <span className="ml-2 normal-case tracking-normal text-ash/60">(opcionalno)</span>}
      </label>
      {children}
      <AnimatePresence initial={false}>
        {error && (
          <motion.p
            id={`${id}-greska`}
            role="alert"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <span className="mt-2 flex items-start gap-2 text-sm text-blood">
              <CircleAlert size={16} strokeWidth={1.75} aria-hidden="true" className="mt-0.5 shrink-0" />
              {error}
            </span>
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

export function Booking() {
  const uid = useId();
  const id = (name: string) => `${uid}-${name}`;
  const { bookingStyle } = useSiteState();

  const [values, setValues] = useState<BookingValues>(emptyBookingValues);
  const [honeypot, setHoneypot] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [errors, setErrors] = useState<BookingErrors>({});
  const [status, setStatus] = useState<Status>("idle");
  const [serverMessage, setServerMessage] = useState("");
  const [backendEnabled, setBackendEnabled] = useState<boolean | null>(null);
  const [message, setMessage] = useState("");
  const [copied, setCopied] = useState(false);
  const messageLinks = useMemo(() => (message ? buildMessageLinks(message) : null), [message]);
  const [dragging, setDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const resultRef = useRef<HTMLDivElement>(null);

  // Minimalni datum u browseru (na serveru prazno — nema hydration razlike).
  const minDate = useClientValue(todayISO, "");

  // Kada korisnik klikne na karticu stila, formular dobija taj stil.
  const [appliedStyle, setAppliedStyle] = useState(bookingStyle);
  if (bookingStyle !== appliedStyle) {
    setAppliedStyle(bookingStyle);
    if (bookingStyle) {
      setValues((current) => ({ ...current, style: bookingStyle }));
      setErrors((current) => ({ ...current, style: undefined }));
    }
  }

  // Da li je slanje na serveru aktivirano (email servis / webhook)?
  useEffect(() => {
    const controller = new AbortController();
    fetch("/api/booking", { cache: "no-store", signal: controller.signal })
      .then((response) => (response.ok ? response.json() : null))
      .then((data: { enabled?: boolean } | null) => setBackendEnabled(Boolean(data?.enabled)))
      .catch(() => {
        if (!controller.signal.aborted) setBackendEnabled(false);
      });
    return () => controller.abort();
  }, []);

  // Preview izabrane fotografije; oslobađanje memorije kada se promeni.
  const previewUrl = useMemo(() => (file && file.type.startsWith("image/") ? URL.createObjectURL(file) : null), [file]);
  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const validateOne = (field: BookingField) => {
    const message = validateField(field, values, file);
    setErrors((current) => ({ ...current, [field]: message }));
    return message;
  };

  // Svako polje se validira samo na osnovu svoje vrednosti, pa uzastopne promene
  // u istom ciklusu (npr. browser autofill) ne gube podatke.
  const changeField = <K extends keyof BookingValues>(field: K, value: BookingValues[K], revalidate: boolean) => {
    setValues((current) => ({ ...current, [field]: value }));
    if (revalidate) {
      const message = validateField(field as BookingField, { ...emptyBookingValues, [field]: value });
      setErrors((current) => ({ ...current, [field]: message }));
    }
  };

  // Čim polje ima grešku, ispravljamo je uživo; inače proveravamo na blur.
  const bind = (field: Exclude<BookingField, "reference" | "confirm">) => ({
    id: id(field),
    "aria-invalid": errors[field] ? true : undefined,
    "aria-describedby": errors[field] ? `${id(field)}-greska` : undefined,
    onBlur: () => validateOne(field),
    onChange: (event: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
      changeField(field, event.target.value, Boolean(errors[field]));
    },
  });

  const chooseFile = (candidate: File | null) => {
    setFile(candidate);
    setErrors((current) => ({ ...current, reference: candidate ? validateField("reference", values, candidate) : undefined }));
  };

  const onFileInput = (event: ChangeEvent<HTMLInputElement>) => {
    chooseFile(event.target.files?.[0] ?? null);
  };

  const onDrop = (event: DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    setDragging(false);
    const dropped = event.dataTransfer.files?.[0];
    if (dropped) chooseFile(dropped);
  };

  const removeFile = () => {
    chooseFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const reset = () => {
    setValues(emptyBookingValues);
    setErrors({});
    setHoneypot("");
    removeFile();
    setStatus("idle");
    setServerMessage("");
    setMessage("");
    setCopied(false);
  };

  // Slanje preko servera nije aktivirano: pripremamo poruku za WhatsApp / Viber / SMS.
  // Zahtev NIJE poslat dok klijent sam ne pritisne „Pošalji" u aplikaciji.
  const prepareMessage = () => {
    setMessage(buildBookingMessage(values, Boolean(file)));
    setCopied(false);
    setStatus("unavailable");
    window.setTimeout(() => resultRef.current?.scrollIntoView({ block: "center" }), 50);
  };

  const copyMessage = async () => {
    try {
      await navigator.clipboard.writeText(message);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2500);
    } catch {
      setCopied(false);
    }
  };

  const focusFirstError = (found: BookingErrors) => {
    const first = bookingFields.find((field) => found[field]);
    if (!first) return;
    const target = first === "reference" ? id("reference") : first === "confirm" ? id("confirm") : id(first);
    document.getElementById(target)?.focus();
  };

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (status === "submitting") return;

    const found = validateBooking(values, file);
    setErrors(found);
    if (Object.keys(found).length > 0) {
      setStatus("idle");
      focusFirstError(found);
      return;
    }

    if (backendEnabled === false) {
      prepareMessage();
      return;
    }

    setStatus("submitting");
    setServerMessage("");

    const body = new FormData();
    (Object.keys(values) as (keyof BookingValues)[]).forEach((key) => body.append(key, String(values[key])));
    body.append("website", honeypot);
    if (file) body.append("reference", file);

    try {
      const response = await fetch("/api/booking", { method: "POST", body });
      const data = (await response.json().catch(() => null)) as {
        ok?: boolean;
        code?: string;
        message?: string;
        errors?: BookingErrors;
      } | null;

      if (response.ok && data?.ok) {
        setStatus("success");
        setServerMessage(data.message ?? "");
      } else if (response.status === 503 || data?.code === "not_configured") {
        setBackendEnabled(false);
        prepareMessage();
        return;
      } else if (data?.errors) {
        setErrors(data.errors);
        setStatus("idle");
        focusFirstError(data.errors);
      } else {
        setStatus("error");
        setServerMessage(data?.message ?? "Došlo je do greške. Pokušaj ponovo.");
      }
    } catch {
      setStatus("error");
      setServerMessage("Nema veze sa serverom. Proveri internet i pokušaj ponovo.");
    }

    window.setTimeout(() => resultRef.current?.scrollIntoView({ block: "center" }), 50);
  };

  const submitting = status === "submitting";

  return (
    <section
      id="zakazivanje"
      aria-labelledby="zakazivanje-naslov"
      className="relative overflow-hidden border-y border-white/10 bg-ink py-28 sm:py-36 lg:py-44"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-40 top-1/3 h-[34rem] w-[34rem] rounded-full bg-blood/20 blur-[140px]"
      />

      <div className="relative mx-auto grid max-w-[1600px] gap-16 px-5 sm:px-8 lg:grid-cols-12 lg:gap-12 lg:px-12">
        {/* Levo: naslov i proces */}
        <div className="lg:sticky lg:top-28 lg:col-span-5 lg:self-start">
          <Reveal>
            <SectionLabel index="05" label="Zakazivanje" />
            <h2
              id="zakazivanje-naslov"
              className="mt-8 font-display text-[clamp(2.8rem,6.4vw,6rem)] font-semibold uppercase leading-[0.92] tracking-tight"
            >
              Imaš ideju?
              <br />
              Hajde da je pretvorimo u <span className="text-blood">tetovažu.</span>
            </h2>
          </Reveal>

          <Reveal delay={0.1}>
            <p className="mt-8 max-w-md text-base leading-relaxed text-bone/70">
              Popuni formular i opiši šta zamišljaš. Što više detalja uneseš, to ćemo brže doći do dizajna koji ti odgovara.
            </p>
            <p className="mt-6 flex max-w-md items-start gap-3 border border-white/10 bg-white/[0.03] p-4 text-sm leading-relaxed text-bone/80">
              <Info size={18} strokeWidth={1.75} aria-hidden="true" className="mt-0.5 shrink-0 text-blood" />
              <span>
                <strong className="font-semibold text-bone">Ovo je zahtev za termin, a ne potvrđena rezervacija.</strong>{" "}
                Termin je potvrđen tek kada ti se javimo i dogovorimo detalje.
              </span>
            </p>
          </Reveal>

          <ol className="mt-12 space-y-0 border-t border-white/10">
            {bookingProcess.map((step, index) => (
              <Reveal as="li" key={step.title} delay={0.1 * index} className="flex gap-5 border-b border-white/10 py-5">
                <span className="font-display text-2xl text-blood">{String(index + 1).padStart(2, "0")}</span>
                <div>
                  <h3 className="font-display text-lg font-medium uppercase tracking-[0.12em]">{step.title}</h3>
                  <p className="mt-1 text-sm text-ash">{step.text}</p>
                </div>
              </Reveal>
            ))}
          </ol>
        </div>

        {/* Desno: formular */}
        <div className="lg:col-span-7 lg:pl-8">
          <Reveal delay={0.1}>
            {backendEnabled === false && status !== "unavailable" && (
              <div
                role="note"
                className="mb-8 flex items-start gap-3 border border-amber-400/30 bg-amber-400/[0.06] p-4 text-sm leading-relaxed text-bone/85"
              >
                <TriangleAlert size={18} strokeWidth={1.75} aria-hidden="true" className="mt-0.5 shrink-0 text-amber-400" />
                <p>
                  <strong className="font-semibold text-bone">Zahtev se šalje porukom.</strong> Popuni formular, a mi
                  ti pripremimo gotovu poruku za WhatsApp, Viber ili SMS. Zahtev je poslat tek kada u aplikaciji
                  pritisneš „Pošalji“.
                </p>
              </div>
            )}

            <div ref={resultRef} className="scroll-mt-28" />

            <AnimatePresence mode="wait" initial={false}>
              {status === "success" ? (
                <motion.div
                  key="success"
                  role="status"
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                  className="border border-white/15 bg-coal p-8 sm:p-12"
                >
                  <CircleCheck size={48} strokeWidth={1.25} aria-hidden="true" className="text-blood" />
                  <h3 className="mt-6 font-display text-4xl font-semibold uppercase leading-tight sm:text-5xl">
                    Zahtev je poslat.
                  </h3>
                  <p className="mt-4 max-w-md text-bone/70">
                    {serverMessage || "Hvala ti!"} Podsetnik: ovo je zahtev, a ne potvrđena rezervacija — termin važi tek
                    nakon našeg odgovora.
                  </p>
                  <div className="mt-8">
                    <Button variant="outline" onClick={reset}>
                      Pošalji novi zahtev
                    </Button>
                  </div>
                </motion.div>
              ) : status === "unavailable" ? (
                <motion.div
                  key="unavailable"
                  role="alert"
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                  className="border border-amber-400/30 bg-coal p-8 sm:p-12"
                >
                  <TriangleAlert size={44} strokeWidth={1.25} aria-hidden="true" className="text-amber-400" />
                  <h3 className="mt-6 font-display text-3xl font-semibold uppercase leading-tight sm:text-4xl">
                    Poruka je spremna — još nije poslata.
                  </h3>
                  <p className="mt-4 max-w-lg text-bone/70">
                    {messageLinks
                      ? "Izaberi aplikaciju i u njoj pritisni „Pošalji“. Tek tada zahtev stiže do studija."
                      : "Slanje trenutno nije dostupno. Pokušaj ponovo kasnije."}
                    {file && messageLinks && " Referentnu fotografiju pošalji u istom razgovoru."}
                  </p>

                  {messageLinks && (
                    <>
                      <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:flex-wrap">
                        <Button href={messageLinks.whatsapp} icon={MessageCircle} external>
                          WhatsApp
                        </Button>
                        <Button href={messageLinks.viber} icon={MessagesSquare} variant="outline">
                          Viber
                        </Button>
                        <Button href={messageLinks.sms} icon={MessageSquare} variant="outline">
                          SMS
                        </Button>
                      </div>
                      <p className="mt-4 max-w-lg text-xs leading-relaxed text-ash">
                        Viber ne popunjava tekst sam — kopiraj poruku i nalepi je u razgovor.
                      </p>

                      <div className="mt-6 border border-white/10 bg-white/[0.03] p-4">
                        <p className="mb-2 text-[0.65rem] font-semibold uppercase tracking-[0.25em] text-ash">
                          Tekst poruke
                        </p>
                        <pre className="max-h-48 overflow-auto whitespace-pre-wrap break-words font-sans text-sm leading-relaxed text-bone/85">
                          {message}
                        </pre>
                      </div>
                    </>
                  )}

                  <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:flex-wrap">
                    {messageLinks && (
                      <Button variant="ghost" icon={Copy} onClick={copyMessage}>
                        {copied ? "Kopirano!" : "Kopiraj poruku"}
                      </Button>
                    )}
                    {contact.telHref && (
                      <Button href={contact.telHref} variant="ghost" icon={Phone}>
                        Pozovi
                      </Button>
                    )}
                    {contact.instagramUrl && (
                      <Button href={contact.instagramUrl} variant="ghost" external>
                        <InstagramIcon size={18} /> Instagram
                      </Button>
                    )}
                    <Button variant="ghost" onClick={() => setStatus("idle")}>
                      Nazad na formular
                    </Button>
                  </div>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  ref={formRef}
                  noValidate
                  onSubmit={onSubmit}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  aria-label="Formular za zahtev za termin"
                  className="grid gap-x-8 gap-y-9 sm:grid-cols-2"
                >
                  <Field id={id("fullName")} label="Ime i prezime" error={errors.fullName}>
                    <input
                      {...bind("fullName")}
                      name="fullName"
                      type="text"
                      autoComplete="name"
                      maxLength={fieldLimits.nameMax}
                      placeholder="Npr. Marko Marković"
                      value={values.fullName}
                      className={cn(inputBase, inputState(!!errors.fullName))}
                    />
                  </Field>

                  <Field id={id("phone")} label="Broj telefona" error={errors.phone}>
                    <input
                      {...bind("phone")}
                      name="phone"
                      type="tel"
                      inputMode="tel"
                      autoComplete="tel"
                      placeholder="+381 60 123 4567"
                      value={values.phone}
                      className={cn(inputBase, inputState(!!errors.phone))}
                    />
                  </Field>

                  <Field id={id("email")} label="Email adresa" optional error={errors.email} className="sm:col-span-2">
                    <input
                      {...bind("email")}
                      name="email"
                      type="email"
                      inputMode="email"
                      autoComplete="email"
                      placeholder="ime@primer.com"
                      value={values.email}
                      className={cn(inputBase, inputState(!!errors.email))}
                    />
                  </Field>

                  <Field id={id("style")} label="Željeni stil tetovaže" error={errors.style}>
                    <div className="relative">
                      <select
                        {...bind("style")}
                        name="style"
                        value={values.style}
                        className={cn(inputBase, inputState(!!errors.style), "appearance-none pr-8", !values.style && "text-ash/50")}
                      >
                        <option value="">Izaberi stil</option>
                        {styleOptions.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                      <ChevronDown size={18} aria-hidden="true" className="pointer-events-none absolute right-0 top-1/2 -translate-y-1/2 text-ash" />
                    </div>
                  </Field>

                  <Field id={id("bodyPart")} label="Deo tela" error={errors.bodyPart}>
                    <div className="relative">
                      <select
                        {...bind("bodyPart")}
                        name="bodyPart"
                        value={values.bodyPart}
                        className={cn(inputBase, inputState(!!errors.bodyPart), "appearance-none pr-8", !values.bodyPart && "text-ash/50")}
                      >
                        <option value="">Izaberi deo tela</option>
                        {bodyPartOptions.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                      <ChevronDown size={18} aria-hidden="true" className="pointer-events-none absolute right-0 top-1/2 -translate-y-1/2 text-ash" />
                    </div>
                  </Field>

                  <Field id={id("size")} label="Približna veličina tetovaže" error={errors.size}>
                    <div className="relative">
                      <select
                        {...bind("size")}
                        name="size"
                        value={values.size}
                        className={cn(inputBase, inputState(!!errors.size), "appearance-none pr-8", !values.size && "text-ash/50")}
                      >
                        <option value="">Izaberi veličinu</option>
                        {sizeOptions.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                      <ChevronDown size={18} aria-hidden="true" className="pointer-events-none absolute right-0 top-1/2 -translate-y-1/2 text-ash" />
                    </div>
                  </Field>

                  <Field id={id("date")} label="Željeni datum termina" error={errors.date}>
                    <input
                      {...bind("date")}
                      name="date"
                      type="date"
                      min={minDate || undefined}
                      value={values.date}
                      className={cn(inputBase, inputState(!!errors.date), !values.date && "text-ash/50")}
                    />
                  </Field>

                  <Field id={id("idea")} label="Opis ideje" error={errors.idea} className="sm:col-span-2">
                    <textarea
                      {...bind("idea")}
                      name="idea"
                      rows={5}
                      maxLength={fieldLimits.ideaMax}
                      placeholder="Opiši motiv, stil, simboliku, boje... Što detaljnije, to bolje."
                      value={values.idea}
                      className={cn(inputBase, inputState(!!errors.idea), "resize-none")}
                    />
                    <p className="mt-1 text-right text-xs text-ash/60" aria-hidden="true">
                      {values.idea.length}/{fieldLimits.ideaMax}
                    </p>
                  </Field>

                  {/* Upload referentne fotografije */}
                  <div className="sm:col-span-2">
                    <span className="mb-3 block text-[0.7rem] font-semibold uppercase tracking-[0.25em] text-ash">
                      Referentna fotografija <span className="ml-2 normal-case tracking-normal text-ash/60">(opcionalno)</span>
                    </span>

                    {file ? (
                      <div className="flex items-center gap-4 border border-white/15 bg-white/[0.03] p-3">
                        {previewUrl && (
                          // eslint-disable-next-line @next/next/no-img-element -- lokalni blob preview, nije za optimizaciju
                          <img src={previewUrl} alt="Pregled izabrane fotografije" className="h-16 w-16 shrink-0 object-cover" />
                        )}
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm text-bone">{file.name}</p>
                          <p className="text-xs text-ash">{formatSize(file.size)}</p>
                        </div>
                        <button
                          type="button"
                          onClick={removeFile}
                          aria-label="Ukloni izabranu fotografiju"
                          className="flex h-10 w-10 shrink-0 items-center justify-center text-ash transition-colors hover:text-blood"
                        >
                          <Trash2 size={18} strokeWidth={1.75} aria-hidden="true" />
                        </button>
                      </div>
                    ) : (
                      <label
                        htmlFor={id("reference")}
                        onDragOver={(event) => {
                          event.preventDefault();
                          setDragging(true);
                        }}
                        onDragLeave={() => setDragging(false)}
                        onDrop={onDrop}
                        className={cn(
                          "flex cursor-pointer flex-col items-center justify-center gap-2 border border-dashed px-6 py-8 text-center transition-colors duration-300 focus-within:border-blood focus-within:bg-blood/[0.05]",
                          dragging ? "border-blood bg-blood/[0.07]" : "border-white/25 hover:border-white/50",
                          errors.reference && "border-blood",
                        )}
                      >
                        <ImagePlus size={28} strokeWidth={1.4} aria-hidden="true" className="text-blood" />
                        <span className="text-sm text-bone">Klikni ili prevuci fotografiju ovde</span>
                        <span className="text-xs text-ash">
                          {referenceFileRules.extensions} · do {referenceFileRules.maxMb} MB
                        </span>
                      </label>
                    )}
                    <input
                      ref={fileInputRef}
                      id={id("reference")}
                      name="reference"
                      type="file"
                      accept={referenceFileRules.accept}
                      onChange={onFileInput}
                      aria-invalid={errors.reference ? true : undefined}
                      aria-describedby={errors.reference ? `${id("reference")}-greska` : undefined}
                      className="sr-only"
                    />
                    <AnimatePresence initial={false}>
                      {errors.reference && (
                        <motion.p
                          id={`${id("reference")}-greska`}
                          role="alert"
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="overflow-hidden"
                        >
                          <span className="mt-2 flex items-start gap-2 text-sm text-blood">
                            <CircleAlert size={16} strokeWidth={1.75} aria-hidden="true" className="mt-0.5 shrink-0" />
                            {errors.reference}
                          </span>
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Honeypot (zaštita od botova) — nevidljivo i van tab redosleda */}
                  <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
                    <label>
                      Website
                      <input
                        type="text"
                        name="website"
                        tabIndex={-1}
                        autoComplete="off"
                        value={honeypot}
                        onChange={(event) => setHoneypot(event.target.value)}
                      />
                    </label>
                  </div>

                  {/* Potvrda */}
                  <div className="sm:col-span-2">
                    <label className="group flex cursor-pointer items-start gap-4">
                      <input
                        id={id("confirm")}
                        name="confirm"
                        type="checkbox"
                        checked={values.confirm}
                        onChange={(event) => changeField("confirm", event.target.checked, true)}
                        aria-invalid={errors.confirm ? true : undefined}
                        aria-describedby={errors.confirm ? `${id("confirm")}-greska` : undefined}
                        className="peer sr-only"
                      />
                      <span
                        aria-hidden="true"
                        className={cn(
                          "mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center border transition-colors duration-300 peer-checked:border-blood peer-checked:bg-blood peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-4 peer-focus-visible:outline-blood [&>svg]:scale-0 peer-checked:[&>svg]:scale-100",
                          errors.confirm ? "border-blood" : "border-white/30 group-hover:border-white/60",
                        )}
                      >
                        <Check size={16} strokeWidth={3} className="text-white transition-transform duration-300" />
                      </span>
                      <span className="text-sm leading-relaxed text-bone/80">
                        Potvrđujem da su uneti podaci ispravni i razumem da je ovo zahtev za termin, a ne automatski
                        potvrđena rezervacija.
                      </span>
                    </label>
                    <AnimatePresence initial={false}>
                      {errors.confirm && (
                        <motion.p
                          id={`${id("confirm")}-greska`}
                          role="alert"
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="overflow-hidden"
                        >
                          <span className="mt-2 flex items-start gap-2 text-sm text-blood">
                            <CircleAlert size={16} strokeWidth={1.75} aria-hidden="true" className="mt-0.5 shrink-0" />
                            {errors.confirm}
                          </span>
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </div>

                  <div className="flex flex-col gap-4 sm:col-span-2">
                    {status === "error" && (
                      <p role="alert" className="flex items-start gap-3 border border-blood/40 bg-blood/[0.08] p-4 text-sm text-bone">
                        <CircleAlert size={18} strokeWidth={1.75} aria-hidden="true" className="mt-0.5 shrink-0 text-blood" />
                        {serverMessage}
                      </p>
                    )}
                    <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
                      <Button type="submit" icon={submitting ? undefined : Send} disabled={submitting} className="w-full sm:w-auto">
                        {submitting ? (
                          <>
                            <LoaderCircle size={18} className="animate-spin" aria-hidden="true" /> Šaljem…
                          </>
                        ) : (
                          "POŠALJI ZAHTEV"
                        )}
                      </Button>
                      <p className="flex items-center gap-2 text-xs text-ash">
                        <CalendarDays size={14} aria-hidden="true" /> Odgovor stiže pre potvrde termina.
                      </p>
                    </div>
                  </div>
                </motion.form>
              )}
            </AnimatePresence>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
