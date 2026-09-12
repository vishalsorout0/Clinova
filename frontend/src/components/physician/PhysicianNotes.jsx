export default function PhysicianNotes({
  value,
  onChange,
  disabled = false,
}) {
  return (
    <div className="physician-notes">
      <label htmlFor="physician-notes">
        Physician Notes
      </label>

      <textarea
        id="physician-notes"
        value={value}
        onChange={(event) =>
          onChange(
            event.target.value
          )
        }
        placeholder="Add your clinical review notes..."
        rows={6}
        disabled={disabled}
      />

      <small>
        These notes become part of the
        physician review record.
      </small>
    </div>
  );
}