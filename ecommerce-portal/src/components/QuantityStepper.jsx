export default function QuantityStepper({ quantity, min = 1, max = 99, onChange }) {
  const dec = () => onChange(Math.max(min, quantity - 1));
  const inc = () => onChange(Math.min(max, quantity + 1));

  return (
    <div className="stepper">
      <button type="button" onClick={dec} aria-label="Decrease quantity">
        −
      </button>
      <span>{quantity}</span>
      <button type="button" onClick={inc} aria-label="Increase quantity">
        +
      </button>
    </div>
  );
}
