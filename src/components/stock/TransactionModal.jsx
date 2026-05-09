import { useState }
  from "react";

import { supabase }
  from "../../lib/supabase";

export default function
TransactionModal({

  stock,
  user,
  closeModal,
  refreshStocks,

}) {

  const [type, setType] =
    useState("buy");

  const [price, setPrice] =
    useState("");

  const [quantity, setQuantity] =
    useState("");

    const [
  currentPrice,
  setCurrentPrice,
    ] = useState(
  stock.current_price || ""
    );

  async function handleSave() {

    const totalAmount =
      Number(price) *
      Number(quantity);

    const { error } =
      await supabase
        .from(
          "stock_transactions"
        )
        .insert([

          {

            stock_id: stock.id,

            user_id: user.id,

            type,

            price:
              Number(price),

            quantity:
              Number(quantity),

            total_amount:
              totalAmount,

          },

        ]);

    if (error) {

      alert(error.message);

      return;

    }

    let newQuantity =
      Number(stock.quantity);

    let newBuyAmount =
      Number(
        stock.total_buy_amount
      );

    if (type === "buy") {

      newQuantity +=
        Number(quantity);

      newBuyAmount +=
        totalAmount;

    } else {

      newQuantity -=
        Number(quantity);

      newBuyAmount -=
        Number(stock.buy_price) *
        Number(quantity);

    }

    if (newQuantity < 0) {

      alert(
        "보유수량보다 많이 매도할 수 없습니다."
      );

      return;

    }

    const avgPrice =
      newQuantity > 0
        ? newBuyAmount /
          newQuantity
        : 0;

    const latestPrice =
  Number(currentPrice);

const profitAmount =
  (latestPrice -
    avgPrice) *
  newQuantity;

    const profitRate =
      avgPrice > 0
        ? ((stock.current_price -
            avgPrice) /
            avgPrice) *
          100
        : 0;

    await supabase
      .from("stocks")
      .update({

        quantity:
          newQuantity,

        total_buy_amount:
          newBuyAmount,

        buy_price: avgPrice,

        current_price:
      latestPrice,

        profit_amount:
          profitAmount,

        profit_rate:
          profitRate,

      })
      .eq("id", stock.id);

    refreshStocks();

    closeModal();

  }

  return (

    <div className="modal-overlay">

      <div className="modal-card">

        <h2>
          거래 추가
        </h2>

        <select
          value={type}
          onChange={(e) =>
            setType(e.target.value)
          }
        >

          <option value="buy">
            추가 매수
          </option>

          <option value="sell">
            매도
          </option>

        </select>

        <input
          type="number"
          placeholder="거래 가격"
          value={price}
          onChange={(e) =>
            setPrice(
              e.target.value
            )
          }
        />

        <input
          type="number"
          placeholder="수량"
          value={quantity}
          onChange={(e) =>
            setQuantity(
              e.target.value
            )
          }
        />

        <input
            type="number"
            placeholder="현재가"

            value={currentPrice}

            onChange={(e) =>
            setCurrentPrice(
                e.target.value
            )
            }
        />

        <button
          className="save-btn"
          onClick={handleSave}
        >
          저장
        </button>

        <button
          className="cancel-btn"
          onClick={closeModal}
        >
          취소
        </button>

      </div>

    </div>

  );

}