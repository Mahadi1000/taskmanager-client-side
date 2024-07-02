import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
// import { useDispatch } from "react-redux";

//Get all Task action
export const getAllTasks = createAsyncThunk(
  "getTasks",
  async (args, { rejectWithValue }) => {
    try {
      const response = await fetch("http://localhost:5000/tasks")
      const result = await response.json()
      return result;
    } catch (err) {
      return rejectWithValue("Oops found an error", err.response.data);
    }
  }
);

//create Task

export const createTask = createAsyncThunk(
  "createTask",
  async (taskData, { rejectWithValue }) => {
    try {
      // Include the status field with the task data
      const dataWithStatus = { ...taskData, status: "pending" };

      const response = await fetch("http://localhost:5000/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataWithStatus),
      });

      const result = await response.json();
      return result;
    } catch (err) {
      return rejectWithValue("Oops found an error", err.response.data);
    }
  }
);

// Update Task Status action
export const updateTaskStatus = createAsyncThunk(
  "tasks/updateStatus",
  async ({ id, status }, { rejectWithValue }) => {
    try {
      const response = await fetch(`http://localhost:5000/tasks/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      });
      const result = await response.json();
      return result;
    } catch (err) {
      return rejectWithValue("Oops found an error", err.response.data);
    }
  }
);

 
 //update Task status

export const updateTask = createAsyncThunk(
  "tasks/updateTask",
  async (taskData, { rejectWithValue }) => {
    try {
      const response = await fetch(
        `http://localhost:5000/tasks/${taskData.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(taskData),
        }
      );
      const result = await response.json();
      return result;
    } catch (err) {
      return rejectWithValue("Oops found an error", err.response.data);
    }
  }
);


// Delete Task action
export const deleteTask = createAsyncThunk(
  "deleteTask",
  async (taskId, { rejectWithValue }) => {
    try {
      const response = await fetch(`http://localhost:5000/tasks/${taskId}`, {
        method: "DELETE",
      });
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || "Failed to delete task");
      }
      return taskId;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);
const initialState = {
  tasks: [],
  loading: false,
  error: null,
  userSpecificTasks: [],
};

const tasksSlice = createSlice({
  name: "tasksSlice",
  initialState,
  reducers: {
    addTask: (state, { payload }) => {
      if (state.tasks.length === 0) {
        state.tasks.push({ id: 1, status: "pending", ...payload });
      } else {
        const lastElement = state.tasks.at(-1);
        state.tasks.push({
          id: lastElement.id + 1,
          status: "pending",
          ...payload,
        });
      }
    },
    removeTask: (state, { payload }) => {
      state.tasks = state.tasks.filter((item) => item.id !== payload);
    },
    updateStatus: (state, { payload }) => {
      const target = state.tasks.find((item) => item.id === payload.id);
      target.status = payload.status;
    },
    userTasks: (state, { payload }) => {
      state.userSpecificTasks = state.tasks.filter(
        (item) =>
          item.assignedTo === payload &&
          (item.status === "pending" || item.status === "running")
      );
    },
  },
  extraReducers: {
    [getAllTasks.pending]: (state) => {
      state.loading = true;
    },
    [getAllTasks.fulfilled]: (state, action) => {
      state.loading = false;
      state.tasks = action.payload;
    },
    [getAllTasks.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    [createTask.fulfilled]: (state, action) => {
      state.loading = false;
      state.tasks.push(action.payload);
    },
    [createTask.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    [updateTask.fulfilled]: (state, action) => {
      state.loading = false;
      const updatedTask = action.payload;
      const existingTask = state.tasks.find(
        (task) => task.id === updatedTask.id
      );
      if (existingTask) {
        existingTask.status = updatedTask.status;
      }
    },
    [updateTask.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    [deleteTask.pending]: (state) => {
      state.loading = true;
    },
    [deleteTask.fulfilled]: (state, action) => {
      state.loading = false;
      state.tasks = state.tasks.filter((task) => task._id !== action.payload);
    },
    [deleteTask.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    [updateTask.pending]: (state) => {
    state.loading = true;
  },
  [updateTask.fulfilled]: (state, action) => {
    state.loading = false;
    const index = state.tasks.findIndex(task => task._id === action.payload._id);
    if (index !== -1) {
      state.tasks[index] = action.payload;
    }
  },
  [updateTask.rejected]: (state, action) => {
    state.loading = false;
    state.error = action.payload;
  },
  },
});

export const { addTask, updateStatus, removeTask, userTasks } =
  tasksSlice.actions;

export default tasksSlice.reducer;
