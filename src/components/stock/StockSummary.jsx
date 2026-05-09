export default function StockSummary({
  stocks,
}) {

  const totalBuy =
    stocks.reduce(
      (sum, stock) =>
        sum +
        Number(
          stock.total_buy_amount
        ),
      0
    );

  const totalProfit =
    stocks.reduce(
      (sum, stock) =>
        sum +
        Number(stock.profit_amount),
      0
    );

  const totalCurrent =
    totalBuy + totalProfit;

  const totalRate =
    totalBuy > 0
      ? (totalProfit / totalBuy) *
        100
      : 0;

  return (
    <div className="summary-grid">

      <div className="summary-card">

        <h3>
          총 매입금액
        </h3>

        <p>
          {totalBuy.toLocaleString()}원
        </p>

      </div>

      <div className="summary-card">

        <h3>
          총 평가금액
        </h3>

        <p>
          {totalCurrent.toLocaleString()}원
        </p>

      </div>

      <div className="summary-card">

        <h3>
          총 수익률
        </h3>

        <p
          className={
            totalRate >= 0
              ? "profit"
              : "loss"
          }
        >
          {totalRate.toFixed(2)}%
        </p>

      </div>

    </div>
  );

}