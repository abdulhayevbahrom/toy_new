export const DeliveryInfoBlock = ({ deliveryData, address }) => {
  return (
    <div className="card-block-element delivery-info">
      <h3>Способ доставки</h3>
      <div className="wrapper">
        <p>Доставка по адрес:</p>
        <span>
          {deliveryData == "2"
            ? address
            : "Республика Крым, г. Симферополь, ул. Ленина, д 120"}
        </span>
        <p>Стоимость доставки:</p>
        <span>
          {deliveryData == "2" ? "Pассчитывается индивидуально" : "Бесплатно"}
        </span>
      </div>
    </div>
  );
};
