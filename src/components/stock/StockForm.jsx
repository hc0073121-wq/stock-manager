import { useState } from "react";
import { supabase } from "../../lib/supabase";

export default function StockForm({
  user,
  refreshStocks,
}) {
  const [stockName, setStockName] =
    useState("");

  const [buyPrice, setBuyPrice] =
    useState("");

  const [quantity, setQuantity] =
    useState("");

  const [totalBuyAmount, setTotalBuyAmount] =
    useState("");

  const [currentPrice, setCurrentPrice] =
    useState("");

  const handleSave = async () => {
    if (!stockName) {
      alert("종목명을 입력하세요");
      return;
    }

    const profitRate =
      ((currentPrice - buyPrice) /
        buyPrice) *
      100;

    const profitAmount =
      (currentPrice - buyPrice) *
      quantity;

    const { error } = await supabase
      .from("stocks")
      .insert([
        {
          user_id: user.id,

          stock_name: stockName,

          buy_price: Number(buyPrice),

          quantity: Number(quantity),

          total_buy_amount:
            Number(totalBuyAmount),

          current_price:
            Number(currentPrice),

          profit_rate: profitRate,

          profit_amount: profitAmount,
        },
      ]);

    if (error) {
      alert(error.message);
      return;
    }

    alert("저장 완료");

    refreshStocks();

    setStockName("");
    setBuyPrice("");
    setQuantity("");
    setTotalBuyAmount("");
    setCurrentPrice("");
  };

  return (
    <div className="stock-form-card">
      <h2>종목 추가</h2>

      <input
        placeholder="종목명"
        value={stockName}
        onChange={(e) =>
          setStockName(e.target.value)
        }
      />

      <input
        type="number"
        placeholder="매입가"
        value={buyPrice}
        onChange={(e) =>
          setBuyPrice(e.target.value)
        }
      />

      <input
        type="number"
        placeholder="보유수량"
        value={quantity}
        onChange={(e) =>
          setQuantity(e.target.value)
        }
      />

      <input
        type="number"
        placeholder="매입금액"
        value={totalBuyAmount}
        onChange={(e) =>
          setTotalBuyAmount(
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

      <button onClick={handleSave}>
        저장
      </button>
    </div>
  );
}