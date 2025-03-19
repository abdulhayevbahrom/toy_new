export const PayTypeDeliveryBlock = ({ deliveryData, setDeliveryData, paymentData, setPaymentData }) => {
  return (
    <div className="card-block-element container-order-data">
      <div className="order-form-select-group">
        {/* Yetkazib berish turi */}
        <div className="order-choise-btn-label">
          <select
            className="choise-btn"
            value={deliveryData}
            onChange={(e) => setDeliveryData(e.target.value)}
          >
            <option value="1" style={{ fontWeight: "normal", color: "#fff", padding: "5px" }}>Самовывоз</option>
            <option value="2" style={{ fontWeight: "normal", color: "#fff", padding: "5px" }}>Доставка</option>
          </select>
        </div>

        {/* To'lov turi */}
        <div className="order-choise-btn-label">
          <select
            className="choise-btn"
            value={paymentData}
            onChange={(e) => setPaymentData(e.target.value)}
          >
            <option value="3" style={{ fontWeight: "normal", color: "#fff", padding: "5px" }}>Наличными</option>
            <option value="4" style={{ fontWeight: "normal", color: "#fff", padding: "5px" }}>Онлайн</option>
          </select>
        </div>
      </div>
    </div>
  );
};