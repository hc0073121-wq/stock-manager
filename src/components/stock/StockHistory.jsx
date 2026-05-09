export default function StockHistory({
  history,
}) {

  return (

    <div className="history-wrap">

      <h2>
        저장 기록
      </h2>

      {history.map((item) => (

        <div
          key={item.id}
          className="history-card"
        >

          <p>
            매입가:
            {" "}
            {item.buy_price}
          </p>

          <p>
            현재가:
            {" "}
            {item.current_price}
          </p>

          <p>
            수량:
            {" "}
            {item.quantity}
          </p>

        </div>

      ))}

    </div>

  );

}