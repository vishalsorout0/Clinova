export default function Loader({ text = "Loading..." }) {
  return (
    <div className="loader-container">
      <div className="loader-spinner" />
      <p>{text}</p>
    </div>
  );
}