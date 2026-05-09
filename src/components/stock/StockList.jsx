import { useState }
  from "react";

import {
  Star,
} from "lucide-react";

import { supabase }
  from "../../lib/supabase";

import StockModal
  from "./StockModal.jsx";

import TransactionModal
  from "./TransactionModal.jsx";

export default function StockList({

  stocks,
  refreshStocks,

}) {

    const [
  expandedCards,
  setExpandedCards,
] = useState([]);

function toggleCard(id) {

  if (
    expandedCards.includes(id)
  ) {

    setExpandedCards(

      expandedCards.filter(
        (cardId) =>
          cardId !== id
      )

    );

  } else {

    setExpandedCards([
      ...expandedCards,
      id,
    ]);

  }

}

  const [
    selectedStock,
    setSelectedStock,
  ] = useState(null);

  const [
  transactionStock,
  setTransactionStock,
] = useState(null);

  async function handleDelete(id) {

    const ok =
      confirm(
        "정말 삭제하시겠습니까?"
      );

    if (!ok) return;

    await supabase
      .from("stocks")
      .delete()
      .eq("id", id);

    refreshStocks();

  }

  async function toggleFavorite(
    stock
  ) {

    const { error } =
      await supabase
        .from("stocks")
        .update({

          favorite:
            !stock.favorite,

        })
        .eq("id", stock.id);

    if (error) {

      alert(error.message);

      return;

    }

    refreshStocks();

  }

  return (

    <>

      <div className="stock-list">

        {stocks.map((stock) => (

          <div
            key={stock.id}
            className="stock-card"

            onClick={() =>
    toggleCard(stock.id)
  }
          >

            <div className="stock-top">

  <div className="stock-title-wrap">

    <h3>
      {stock.stock_name}
    </h3>

    <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>

      <button
        className="favorite-btn"
        onClick={() =>
          toggleFavorite(stock)
        }
      >

        <Star
          size={22}
          fill={
            stock.favorite
              ? "#facc15"
              : "none"
          }
          color={
            stock.favorite
              ? "#facc15"
              : "#9ca3af"
          }
        />

      </button>

      {/* ⭐ 여기 추가 (접기 버튼) */}
      <button
        className="toggle-btn"
        onClick={() =>
          toggleCard(stock.id)
        }
      >
        {expandedCards.includes(stock.id)
          ? "▲"
          : "▼"}
      </button>

    </div>

  </div>

              <div className="stock-actions">

                <button
                className="buy-btn"
                onClick={() =>
                setTransactionStock(stock)
                }
                >
                거래추가
                </button>

                <button
                  className="edit-btn"
                  onClick={() =>
                    setSelectedStock(stock)
                  }
                >
                  수정
                </button>

                <button
                  className="delete-btn"
                  onClick={() =>
                    handleDelete(stock.id)
                  }
                >
                  삭제
                </button>

              </div>

            </div>

            {expandedCards.includes(
  stock.id
) && (

  <>

            <p>
              매입가:
              {" "}
              {stock.buy_price.toLocaleString()}원
            </p>

            <p>
              현재가:
              {" "}
              {stock.current_price.toLocaleString()}원
            </p>

            <p>
              보유수량:
              {" "}
              {stock.quantity}
            </p>

            <p>
              매입금액:
              {" "}
              {stock.total_buy_amount.toLocaleString()}원
            </p>

            <p
              className={
                stock.profit_rate >= 0
                  ? "profit"
                  : "loss"
              }
            >
              수익률:
              {" "}
              {stock.profit_rate.toFixed(2)}%
            </p>

            <p
              className={
                stock.profit_amount >= 0
                  ? "profit"
                  : "loss"
              }
            >
              손익:
              {" "}
              {stock.profit_amount.toLocaleString()}원
            </p>

            </>

)}

          </div>

        ))}

      </div>

      {selectedStock && (

        <StockModal

          stock={selectedStock}

          closeModal={() =>
            setSelectedStock(null)
          }

          refreshStocks={refreshStocks}

        />

      )}

      {transactionStock && (

      <TransactionModal

        stock={transactionStock}

        user={{
          id:
            transactionStock.user_id,
        }}

        closeModal={() =>
          setTransactionStock(null)
        }

        refreshStocks={
          refreshStocks
        }

      />

    )}

    </>

  );

}