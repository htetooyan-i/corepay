type ProfileFieldProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  autoComplete: string;
  disabled: boolean;
  required?: boolean;
};

export function ProfileField({
  label,
  value,
  onChange,
  type = "text",
  autoComplete,
  disabled,
  required = true,
}: ProfileFieldProps) {
  return (
    <label className="block text-sm font-medium text-slate-700">
      {label}
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        type={type}
        autoComplete={autoComplete}
        required={required}
        disabled={disabled}
        className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-500"
      />
    </label>
  );
}

export function ProfileValue({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div>
      <dt className="text-sm font-medium text-slate-500">{label}</dt>
      <dd className="mt-2 text-sm font-medium text-slate-950">
        {value || "Not provided"}
      </dd>
    </div>
  );
}
