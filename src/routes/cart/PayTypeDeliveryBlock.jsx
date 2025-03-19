export const PayTypeDeliveryBlock = ({
  deliveryData,
  setDeliveryData,
  paymentData,
  setPaymentData,
}) => {
  const handleChangeDelivery = (e) => {
    setDeliveryData(e.target.value);
  };

  const handleChangePayment = (e) => {
    setPaymentData(e.target.value);
  };

  return (
    <div className="card-block-element container-order-data">
      <div className="order-form-select-group">
        <div className="order-choise-btn-label">
          <select
            className="choise-btn"
            value={deliveryData}
            onChange={handleChangeDelivery}
          >
            <option value="1">Самовывоз</option>
          </select>
        </div>
        <div
          className="order-choise-btn-label"
          value={paymentData}
          onChange={handleChangePayment}
        >
          <select className="choise-btn">
            <option value="3">Наличными</option>
            <option value="4">Онлайн</option>
          </select>
        </div>
      </div>
    </div>
  );
};
