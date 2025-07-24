import './App.css';
import { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import Todo from './component/Todo';

function App() {
  //년,월,일
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [showComp, setShowComp] = useState(false);


  const [todoState, setTodoState] = useState(() => {
    const saved = JSON.parse(localStorage.getItem('todoState')) || {};
    return saved;
  });
  useEffect(() => {
    localStorage.setItem('todoState', JSON.stringify(todoState));
  }, [todoState]);

  const month = currentDate.getMonth() + 1;
  const year = currentDate.getFullYear();
  const today = currentDate.getDate();
  const isToday = (day) => {
    const today = new Date();
    return (
      today.getDate() === day &&
      today.getMonth() === currentDate.getMonth() &&
      today.getFullYear() === currentDate.getFullYear()
    );
  };
  const goToday = () => {setCurrentDate(new Date());};
  const firstDay = new Date(year, currentDate.getMonth(), 1).getDay();
  const lastday = new Date(year, currentDate.getMonth() + 1, 0).getDate();


  //list 토글용
  const [listToggle, setListToggle] = useState(false);
  const listToggleBtn = () =>{
    setListToggle(!listToggle)
  };
  const currentMonth = Object.entries(todoState).filter(([date, todos]) => {
    const [y, m] = date.split('-');
    return +y === year && +m === month && todos?.length;
  });


  //이름,월 이동
  const monthEngNames = ['January','February','March','April','May','June','July','August','September','October','November','December'];
  const dayNames = ['일','월','화','수','목','금','토'];
  const EngNames = monthEngNames[month - 1];
  const moveMonth = (currentday) => {
    const date = new Date(year, currentDate.getMonth() + currentday, 1);
    const on = new Date();
    setCurrentDate(on.getFullYear() === date.getFullYear() && on.getMonth() === date.getMonth()
    ? on : date);
  };
  const toPrevMonth = () => moveMonth(-1);
  const toNextMonth = () => moveMonth(1);


  //배경
  const bgChange = Array.from({ length: 12 }, (_, i) => ({src: `${process.env.PUBLIC_URL}/images/${i + 1}.jpg`,}));
  const [bgImg, setBgImg] = useState(null);
  useEffect(() => {
    const saveImg = localStorage.getItem('bgImage');
    if (saveImg) setBgImg(saveImg);
  }, []);
  const bgImgChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = () => {
        const imgData = reader.result;
        setBgImg(imgData);
        localStorage.setItem('bgImage', imgData);
      };
      reader.readAsDataURL(file);
    }
  };
  const resetBg = () => {
    setBgImg(null);
    localStorage.removeItem('bgImage');
  };


  //캘린더 클릭 이벤트>>투두 열기 명령
  const handleDayClick = (day) => {
    const dateString = `${year}-${month}-${day}`;
    setSelectedDate(dateString);
    setShowComp(true);
  };


  //캘린더
  const Calendar = () => {
    const blanks = Array(firstDay).fill(null);
    const monthDays = Array.from({ length: lastday }, (_, i) => i + 1);
    const allDays = [...blanks, ...monthDays];

    return allDays.map((day, index) => {
      if (day === null)
        return <div key={index} className="w-12 h-12 m-4 flex items-center justify-center" />;

      //달력 숫자 색상 변경
      const redDay = index % 7 === 0;
      const blueDay = (index + 1) % 7 === 0;
      const dayColor = redDay ? 'text-red-500' : blueDay ? 'text-blue-500' : '';

      //투두가 있는 날짜 표시
      const dateString = `${year}-${month}-${day}`;
      const todoData = todoState[dateString] || [];

      return (
        <div key={index} className={`relative w-12 h-12 m-4 cursor-pointer flex items-center justify-center font-asta ${dayColor} ${ isToday(day) ? 'bg-red-300 text-white rounded-full' : ''}`}onClick={() => handleDayClick(day)}>
          {day}
          {todoData.length>0 && (<div className='absolute bottom-0 right-0 flex items-center justify-center w-4 h-4 bg-blue-600 rounded-full text-white text-xs'>{todoData.length}</div>)}
        </div>
      )
    });
  };

  return (
    <div className="App min-w-[800px] w-[90%] h-[71%] shadow-lg shadow-gray-700/20 rounded-2xl overflow-hidden absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] flex flex-row">
      {/* 왼쪽 섹션 */}
      <section className="w-[35%] h-full relative">
        <div className="absolute top-7 right-6 text-white cursor-pointer flex gap-2 z-10">
          <div className="border border-1-white rounded-lg px-2 py-1">
            <input type="file" id="file" accept="image/*" onChange={bgImgChange} className="absolute w-0 h-0 p-0 overflow-hidden border-0" />
            <label htmlFor="file" className="cursor-pointer">배경 이미지 바꾸기</label>
          </div>
          <button className="border border-1-white rounded-lg px-2 py-1" onClick={resetBg}>배경 초기화</button>
        </div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[10] text-center font-asta">
          <p className="text-white font-light text-xl"><span className="ml-3">{year}&nbsp;</span>{EngNames}</p>
          <p className="text-white text-9xl">{today}</p>
        </div>
        <div className="w-auto h-full">
          <img src={bgImg || bgChange[month - 1].src} alt="" className="w-full h-full object-cover" />
        </div>
      </section>
      {/* 오른쪽 섹션 aspect-square  */}
      <section className="flex flex-col items-start w-[65%] h-full relative">
        {/* 상단 */}
        <div className="w-full p-4 h-24 flex items-center">
          <div className="flex text-xl justify-center font-semibold">
            <button onClick={toPrevMonth}><ChevronLeft className="w-[32px] h-[32px] text-orange-400 opacity-60 hover:opacity-100 transition-opacity" /></button>
            <h2 className="text-2xl mx-2">{year}년 {month}월</h2>
            <button onClick={toNextMonth}><ChevronRight className="w-[32px] h-[32px] text-orange-400 opacity-60 hover:opacity-100 transition-opacity" /></button>
          </div>
          <div className="ml-auto flex gap-3">
            <button onClick={goToday} className="block py-1 px-2 rounded-lg bg-yellow-200 text-gray-600 capitalize">today</button>
            <button onClick={()=>listToggleBtn()} className="block py-1 px-2 rounded-lg bg-gray-200 text-gray-600 capitalize">list</button>
          </div>
        </div>
        {/* 달력 */}
        <div className="w-full h-full text-center flex flex-col">
          <div className="w-full h-20 grid grid-cols-7 justify-center justify-items-center items-center">
            {dayNames.map((day, index) => (
              <div key={index} className={`w-12 h-12 flex justify-center items-center rounded-full ${day === '일' ? 'bg-red-300 text-white' : day === '토' ? 'bg-blue-300 text-white' : 'bg-gray-100'}`}>{day}</div>
            ))}
          </div>
          <div className="w-full h-auto grid grid-cols-7 justify-items-center items-center">
            <Calendar></Calendar>
          </div>
          {showComp && selectedDate && <Todo closeComp={() => setShowComp(false)} selectedDate={selectedDate} todoState={todoState} setTodoState={setTodoState}/>}
          {listToggle && (
            <div className='h-full w-full absolute bottom-0 left-1/2 -translate-x-1/2 z-[9] h-1/2 p-8 bg-noto bg-cover'>
              <div className='flex align-items-center justify-between'>
                <h2 className="text-3xl font-bold text-indigo-800">{month}월의 Todo List</h2>
                <button onClick={()=>listToggleBtn()}><X /></button>
              </div>
              <div>
                {currentMonth.length === 0 ? (
                <div className="text-center text-gray-400 mt-8">등록된 일정이 없습니다.</div>
              ) : (currentMonth.map(([date, todos]) => (
              <div key={date} className="text-left mt-8">
                <h4 className="text-xl font-bold">{date}</h4>
                {todos.map((todo, index) => (
                <div key={index} className={todo.completed ? 'line-through text-gray-500' : ''}>{todo.text}</div>
                ))}
                </div>
                )))}
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

export default App;