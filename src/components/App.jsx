import React, {
  useEffect,
  useState,
} from "react";

import StockSummary
  from "./stock/StockSummary.jsx";

import StockSearch
  from "./stock/StockSearch.jsx";

import { supabase }
  from "../lib/supabase";

import StockForm
  from "./stock/StockForm.jsx";

import StockList
  from "./stock/StockList.jsx";

import StockHistory
  from "./stock/StockHistory.jsx";

export default function App() {

  const [user, setUser] =
    useState(null);

  const [stocks, setStocks] =
    useState([]);

  const [search, setSearch] =
  useState("");

  const [sortType, setSortType] =
  useState("latest");

  const [history, setHistory] =
  useState([]);

  useEffect(() => {
    checkUser();
  }, []);

  async function fetchHistory() {

  const { data } =
    await supabase
      .from("stock_history")
      .select("*")
      .order("created_at", {
        ascending: false,
      });

  setHistory(data || []);

}

  async function checkUser() {

    const {
      data: { session },
    } =
      await supabase.auth.getSession();

    if (session?.user) {

      setUser(session.user);

      fetchStocks(session.user.id);

      fetchHistory();

    }

  }

  async function fetchStocks(userId) {

    const { data, error } =
      await supabase
        .from("stocks")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", {
          ascending: false,
        });

    if (error) {
      console.error(error);
      return;
    }

    setStocks(data || []);

  }

  async function handleLogout() {

    await supabase.auth.signOut();

    location.href = "/";

  }

  if (!user) {

    return (

      <div className="landing-wrap">

        <div className="landing-card">

          <div className="landing-top">

            <h1>
              주식 관리 사이트
            </h1>

            <p>
              보유 종목과 수익률을
              쉽고 편하게 관리하세요.
            </p>

          </div>

          <div className="landing-buttons">

            <a
              href="/login"
              className="login-btn"
            >
              로그인
            </a>

            <a
              href="/signup"
              className="signup-btn"
            >
              회원가입
            </a>

          </div>

          <div className="landing-info">

            <div className="info-box">

              <h3>
                간편 관리
              </h3>

              <p>
                종목 추가와 수정,
                삭제를 쉽게.
              </p>

            </div>

            <div className="info-box">

              <h3>
                수익률 계산
              </h3>

              <p>
                현재가 입력만으로
                자동 계산.
              </p>

            </div>

            <div className="info-box">

              <h3>
                기록 저장
              </h3>

              <p>
                과거 기록을 계속
                보관 가능.
              </p>

            </div>

          </div>

        </div>

      </div>

    );

  }

  const totalBuyAmount =
  stocks.reduce(

    (sum, stock) =>

      sum +
      Number(
        stock.total_buy_amount
      ),

    0

  );

const totalCurrentValue =
  stocks.reduce(

    (sum, stock) =>

      sum +

      Number(stock.current_price) *
      Number(stock.quantity),

    0

  );

const totalProfit =
  totalCurrentValue -
  totalBuyAmount;

const totalProfitRate =
  totalBuyAmount > 0

    ? (
        (totalProfit /
          totalBuyAmount) *
        100
      )

    : 0;

  const filteredStocks =
  [...stocks]

    .filter((stock) =>
      stock.stock_name
        .toLowerCase()
        .includes(
          search.toLowerCase()
        )
    )

    .sort((a, b) => {

        if (
  a.favorite !==
  b.favorite
) {

  return (
    Number(b.favorite) -
    Number(a.favorite)
  );

}

  if (sortType === "profitHigh") {

    return (
      b.profit_rate -
      a.profit_rate
    );

  }

  if (sortType === "profitLow") {

    return (
      a.profit_rate -
      b.profit_rate
    );

  }

  if (
    sortType ===
    "profitAmountHigh"
  ) {

    return (
      b.profit_amount -
      a.profit_amount
    );

  }

  if (sortType === "lossHigh") {

    return (
      a.profit_amount -
      b.profit_amount
    );

  }

  if (sortType === "buyAmount") {

    return (
      b.total_buy_amount -
      a.total_buy_amount
    );

  }

  if (sortType === "currentValue") {

    return (
      (b.current_price *
        b.quantity) -
      (a.current_price *
        a.quantity)
    );

  }

  if (sortType === "currentPrice") {

    return (
      b.current_price -
      a.current_price
    );

  }

  if (sortType === "quantity") {

    return (
      b.quantity -
      a.quantity
    );

  }

  if (sortType === "favorite") {

    return (
      Number(b.favorite) -
      Number(a.favorite)
    );

  }

  if (sortType === "name") {

    return a.stock_name.localeCompare(
      b.stock_name
    );

  }

  if (sortType === "nameDesc") {

    return b.stock_name.localeCompare(
      a.stock_name
    );

  }

  return (
    new Date(b.created_at) -
    new Date(a.created_at)
  );

})

  return (

    <div className="main-wrap">

      <div className="top-bar">

        <h1>
          주식 관리
        </h1>

        <div className="top-buttons">

          <button>
            {user.email}
          </button>

          <button
            onClick={handleLogout}
          >
            로그아웃
          </button>

        </div>

      </div>

      <StockForm
        user={user}
        refreshStocks={() =>
          fetchStocks(user.id)
        }
      />

      <StockSummary
        stocks={filteredStocks}
        />

        <StockSearch
        search={search}
        setSearch={setSearch}
        sortType={sortType}
        setSortType={setSortType}
        />

      <StockList
        stocks={filteredStocks}
        refreshStocks={() =>
        fetchStocks(user.id)
        }
        />

        <StockHistory history={history} />

    </div>

  );

}