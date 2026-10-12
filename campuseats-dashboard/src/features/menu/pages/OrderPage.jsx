import { useState } from "react";

function OrderPage() {
  const [form, setForm] = useState({ name: "", email: "", qty: 1 });
  const [errors, setErrors] = useState({});
  const [done, setDone] = useState(false);

  function validate(v) {
    const e = {};
    if (v.name.trim().length < 2) e.name = "Name too short";
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v.email))
      e.email = "Enter a valid email";
    if (Number(v.qty) < 1) e.qty = "Qty must be ≥ 1";
    return e;
  }

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleSubmit(e) {
    e.preventDefault();
    const found = validate(form);
    setErrors(found);
    if (Object.keys(found).length === 0) setDone(true);
  }

  if (done)
    return (
      <div className="form-card">
        <h1>Order placed</h1>
        <p>Thanks, {form.name}! Your order is in.</p>
      </div>
    );

  return (
    <>
      <div className="page-head">
        <div>
          <h1>Place an order</h1>
          <p>Tell us who you are and how many you'd like.</p>
        </div>
      </div>
      <form className="form-card" onSubmit={handleSubmit} noValidate>
        <div className="field">
          <label htmlFor="name">Your name</label>
          <input id="name" name="name" value={form.name} onChange={handleChange} />
          {errors.name && <span className="field-error">{errors.name}</span>}
        </div>

        <div className="field">
          <label htmlFor="email">Email</label>
          <input id="email" name="email" type="email" value={form.email} onChange={handleChange} />
          {errors.email && <span className="field-error">{errors.email}</span>}
        </div>

        <div className="field">
          <label htmlFor="qty">Quantity</label>
          <input id="qty" name="qty" type="number" min="1" value={form.qty} onChange={handleChange} />
          {errors.qty && <span className="field-error">{errors.qty}</span>}
        </div>

        <button className="btn" type="submit">Place order</button>
      </form>
    </>
  );
}

export default OrderPage;
