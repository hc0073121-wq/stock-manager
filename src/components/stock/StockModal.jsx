import { useState } from "react";

import { supabase }
  from "../../lib/supabase";

export default function StockModal({

  stock,
  closeModal,
  refreshStocks,

}) {

  const [buyPrice, setBuyPrice] =
    useState(stock.buy_price);

  const [quantity, setQuantity] =
    useState(stock.quantity);

  const [
    totalBuyAmount,
    setTotalBuyAmount,
  ] = useState(
    stock.total_buy_amount
  );

  const [currentPrice, setCurrentPrice] =
    useState(stock.current_price);

  async function handleUpdate() {

    const profitRate =
      ((currentPrice - buyPrice) /
        buyPrice) *
      100;

    const profitAmount =
      (currentPrice - buyPrice) *
      quantity;

    await supabase
      .from("stocks")
      .update({

        buy_price: Number(buyPrice),

        quantity: Number(quantity),

        total_buy_amount:
          Number(totalBuyAmount),

        current_price:
          Number(currentPrice),

        profit_rate: profitRate,

        profit_amount: profitAmount,

      })
      .eq("id", stock.id);

    await supabase
      .from("stock_history")
      .insert([

        {
          stock_id: stock.id,

          buy_price: Number(buyPrice),

          current_price:
            Number(currentPrice),

          quantity: Number(quantity),
        },

      ]);

    alert("수정 완료");

    refreshStocks();

    closeModal();

  }

  return (

    <div className="modal-overlay">

      <div className="modal-card">

        <h2>
          종목 수정
        </h2>

        <input
          type="number"
          value={buyPrice}
          onChange={(e) =>
            setBuyPrice(
              e.target.value
            )
          }
        />

        <input
          type="number"
          value={quantity}
          onChange={(e) =>
            setQuantity(
              e.target.value
            )
          }
        />

        <input
          type="number"
          value={totalBuyAmount}
          onChange={(e) =>
            setTotalBuyAmount(
              e.target.value
            )
          }
        />

        <input
          type="number"
          value={currentPrice}
          onChange={(e) =>
            setCurrentPrice(
              e.target.value
            )
          }
        />

        <div className="modal-buttons">

          <button
            onClick={handleUpdate}
            className="save-btn"
          >
            저장
          </button>

          <button
            onClick={closeModal}
            className="cancel-btn"
          >
            취소
          </button>

        </div>

      </div>

    </div>

  );

}