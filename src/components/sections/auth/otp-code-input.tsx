import { authInputClassName } from "./auth-form-field";

type OtpCodeInputProps = {
  id: string;
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
};

export function OtpCodeInput({
  id,
  value,
  onChange,
  disabled = false,
}: OtpCodeInputProps) {
  return (
    <input
      id={id}
      type="text"
      inputMode="numeric"
      autoComplete="one-time-code"
      pattern="\d{6}"
      maxLength={6}
      required
      disabled={disabled}
      value={value}
      onChange={(event) => onChange(event.target.value.replace(/\D/g, "").slice(0, 6))}
      placeholder="000000"
      className={`${authInputClassName} text-center text-lg tracking-[0.4em]`}
    />
  );
}
