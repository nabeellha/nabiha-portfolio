"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Send } from "lucide-react";

const schema = z.object({
  name: z.string().trim().min(2, "Please enter your name").max(80),
  email: z.string().email("Enter a valid email").max(254),
  subject: z.string().trim().min(3, "Add a short subject").max(160),
  message: z
    .string()
    .trim()
    .min(10, "Please write at least 10 characters")
    .max(3000),
  website: z.string().max(0).optional(),
});

type Form = z.infer<typeof schema>;

export function ContactForm() {
  const [status, setStatus] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<Form>({
    resolver: zodResolver(schema),
  });

  const submit = async (data: Form) => {
    setStatus("");

    const response = await fetch("/api/contact", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (response.ok) {
      setStatus("Thank you — your message is on its way.");
      reset();
    } else if (response.status === 429) {
      setStatus("Please wait a minute before trying again.");
    } else {
      setStatus("Something went wrong. Please try again.");
    }
  };

  const field =
    "focus-ring w-full rounded-xl border border-white/10 bg-slate-950/50 px-4 py-3 text-sm text-white placeholder:text-slate-600";

  return (
    <form
      onSubmit={handleSubmit(submit)}
      className="grid gap-4"
      noValidate
    >
      <input
        className="hidden"
        tabIndex={-1}
        autoComplete="off"
        {...register("website")}
      />

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="grid gap-2 text-sm">
          Name
          <input
            className={field}
            placeholder="Your name"
            {...register("name")}
          />
          {errors.name && (
            <small className="text-pink">{errors.name.message}</small>
          )}
        </label>

        <label className="grid gap-2 text-sm">
          Email
          <input
            className={field}
            placeholder="you@example.com"
            {...register("email")}
          />
          {errors.email && (
            <small className="text-pink">{errors.email.message}</small>
          )}
        </label>
      </div>

      <label className="grid gap-2 text-sm">
        Subject
        <input
          className={field}
          placeholder="How can I help?"
          {...register("subject")}
        />
        {errors.subject && (
          <small className="text-pink">{errors.subject.message}</small>
        )}
      </label>

      <label className="grid gap-2 text-sm">
        Message
        <textarea
          className={field}
          rows={5}
          placeholder="Tell me about your project..."
          {...register("message")}
        />
        {errors.message && (
          <small className="text-pink">{errors.message.message}</small>
        )}
      </label>

      <button
        type="submit"
        disabled={isSubmitting}
        className="focus-ring inline-flex w-fit items-center gap-2 rounded-full bg-violet px-5 py-3 text-sm font-semibold text-white transition hover:bg-violet/80 disabled:opacity-60"
      >
        <Send size={16} />
        {isSubmitting ? "Sending..." : "Send message"}
      </button>

      {status && (
        <p aria-live="polite" className="text-sm text-cyan">
          {status}
        </p>
      )}
    </form>
  );
}
