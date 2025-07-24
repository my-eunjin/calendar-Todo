import { useState } from "react";

function Todo({ closeComp, selectedDate, todoState, setTodoState }) {
  const [inputState, setInputState] = useState('');
  const addBtn = () => {
    if (!inputState.trim()) return;
    setTodoState(prev => ({
      ...prev,
      [selectedDate]: [...(prev[selectedDate] || []), { text: inputState, completed: false }]
    }));
    setInputState('');
  };
  const removeBtn = (index) => {
    setTodoState(prev => ({
      ...prev,
      [selectedDate]: prev[selectedDate].filter((_, i) => i !== index)
    }));
  };
  const toggleBtn = (index) => {
    setTodoState(prev => ({
      ...prev,
      [selectedDate]: prev[selectedDate].map((todo, i) =>
        i === index ? { ...todo, completed: !todo.completed } : todo
      )
    }));
  };

  
  return (
    <div className="fixed top-0 right-0 bg-black/30 w-[65%] h-full z-[999]">
      <div className="absolute left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] bg-white min-w-[395px] w-[70%] p-4 h-auto rounded-xl">
        <h2 className="my-6 text-2xl font-bold">일정 등록하기</h2>
        <div className="w-full flex justify-between mb-3">
          <input type="text" placeholder="일정을 등록해 보세요" value={inputState} onChange={(e) => setInputState(e.target.value)} className="w-[85%] h-8 border border-gray-300 pl-3 mr-2" />
          <button onClick={addBtn} className="px-2 py-1 bg-blue-600 rounded-lg text-white">추가</button>
        </div>
        <div className="w-full mb-3">
          <ul className="list-decimal list-outside ml-6">
            {(todoState[selectedDate] || []).map((todo, index) => (
              <li key={index} className="mb-2 w-full">
                <div className="flex justify-between">
                  <span className={`text-left ${todo.completed ? 'line-through text-gray-500' : ''}`}>
                    {todo.text}
                  </span>
                  <div className="flex gap-2">
                    <button onClick={() => toggleBtn(index)} className="px-2 py-1 bg-green-500 rounded-lg text-white">완료</button>
                    <button onClick={() => removeBtn(index)} className="px-2 py-1 bg-red-500 rounded-lg text-white">삭제</button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
        <button onClick={closeComp} className="px-4 py-1 mt-4 bg-gray-400 rounded-lg text-white">닫기</button>
      </div>
    </div>
  );
}

export default Todo;