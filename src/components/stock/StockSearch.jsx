export default function StockSearch({

  search,
  setSearch,

  sortType,
  setSortType,

}) {

  return (

    <div className="search-wrap">

      <input
        placeholder="종목 검색"
        value={search}
        onChange={(e) =>
          setSearch(e.target.value)
        }
      />

      <select
        value={sortType}
        onChange={(e) =>
          setSortType(e.target.value)
        }
      >

        <option value="latest">
  최신순
</option>

<option value="name">
  이름순
</option>

<option value="nameDesc">
  이름 역순
</option>

<option value="profitHigh">
  수익률 높은순
</option>

<option value="profitLow">
  수익률 낮은순
</option>

<option value="profitAmountHigh">
  손익 큰순
</option>

<option value="lossHigh">
  손실 큰순
</option>

<option value="buyAmount">
  매입금액 큰순
</option>

<option value="currentValue">
  평가금액 큰순
</option>

<option value="currentPrice">
  현재가 높은순
</option>

<option value="quantity">
  보유수량 많은순
</option>

<option value="favorite">
  즐겨찾기 우선
</option>

      </select>

    </div>

  );

}