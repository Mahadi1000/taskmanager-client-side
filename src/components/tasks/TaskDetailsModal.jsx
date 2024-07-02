import { useDispatch, useSelector } from "react-redux";
import Modal from "../ui/Modal";
import { useState } from "react";
import { updateTask } from "../../redux/features/tasks/tasksSlice";

const TaskDetailsModal = ({ isOpen, setIsOpen, taskId }) => {
  const dispatch = useDispatch();
  const { tasks } = useSelector((state) => state.tasksSlice);
  const task = tasks.find((item) => item.id === taskId);
  console.log(task);
  const [description, setDescription] = useState(task?.description || "");
  const [status, setStatus] = useState(task?.status || "pending");

  const handleUpdate = () => {
    const updatedTask = {
      id: task._id,
      description,
      status,
    };
    dispatch(updateTask(updatedTask)).then(() => {
      setIsOpen(false);
    });
  };

  return (
    <Modal isOpen={isOpen} setIsOpen={setIsOpen} title={task?.title}>
      <div className="flex items-center w-full">
        <label>
          Description:
          <textarea
            className="bg-slate-100 w-full text-slate-600 h-20 placeholder:text-slate-600 placeholder:opacity-50 border border-slate-200 col-span-6 resize-none outline-none rounded-lg p-2 duration-300 focus:border-slate-600"
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </label>
      </div>
      <div>
        <label>
          Status:
          <select value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="pending">Pending</option>
            <option value="running">Running</option>
            <option value="done">Done</option>
            <option value="archive">Archive</option>
          </select>
        </label>
      </div>
      <div className="flex justify-around py-5">
        <div className="max-w-32 bg-transparent items-center justify-center flex border-2 border-sky-500 shadow-lg hover:bg-sky-500 text-sky-500 hover:text-white duration-300 cursor-pointer active:scale-[0.98]">
          <button className="px-5 py-2" onClick={handleUpdate}>
            Update
          </button>
        </div>
        <button
          onClick={() => setIsOpen(false)}
          className="relative border-2 border-black group hover:border-green-500 w-12 h-10 duration-500 overflow-hidden"
          type="button"
        >
          <p className="font-Manrope text-3xl h-full w-full flex items-center justify-center text-black duration-500 relative z-10 group-hover:scale-0">
            ×
          </p>
          <span className="absolute w-full h-full bg-green-500 rotate-45 group-hover:top-9 duration-500 top-12 left-0"></span>
          <span className="absolute w-full h-full bg-green-500 rotate-45 top-0 group-hover:left-9 duration-500 left-12"></span>
          <span className="absolute w-full h-full bg-green-500 rotate-45 top-0 group-hover:right-9 duration-500 right-12"></span>
          <span className="absolute w-full h-full bg-green-500 rotate-45 group-hover:bottom-9 duration-500 bottom-12 right-0"></span>
        </button>
      </div>
    </Modal>
  );
};

export default TaskDetailsModal;
