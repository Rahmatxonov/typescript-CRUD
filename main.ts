interface TodoType {
  id: number;
  value: string;
  imageUrl?: string;
}

const SaveStorage = (key: string, data: any): void => {
  window.localStorage.setItem(key, JSON.stringify(data));
};

const GetDataStorage = (key: string): any => {
  const data = window.localStorage.getItem(key);
  return data ? JSON.parse(data) : null;
};

const elForm: HTMLFormElement | null = document.querySelector(".todo-form");
const elList: HTMLElement | null = document.querySelector(".todo-list");
const elInput: HTMLInputElement | null = document.querySelector(".todo-input");
const elImageInput: HTMLInputElement | null =
  document.querySelector(".todo-image-input");

const todoList: TodoType[] = GetDataStorage("todo") || [];
let editingId: number | null = null;

elForm?.addEventListener("submit", async (e: Event) => {
  e.preventDefault();
  if (elInput && elInput.value.trim() !== "") {
    let imageUrl: string | undefined;
    if (elImageInput && elImageInput.files && elImageInput.files[0]) {
      imageUrl = await uploadImage(elImageInput.files[0]);
    }

    if (editingId !== null) {
      updateTodoItem(editingId, elInput.value, imageUrl);
      editingId = null;
    } else {
      const newObj: TodoType = {
        id: todoList.length ? todoList[todoList.length - 1].id + 1 : 1,
        value: elInput.value,
        imageUrl: imageUrl,
      };
      todoList.push(newObj);
      SaveStorage("todo", todoList);
    }
    renderTodo();
    elForm.reset();
  }
});

const uploadImage = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      resolve(reader.result as string);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

const renderTodo = (): void => {
  if (elList) {
    elList.innerHTML = "";
    todoList.forEach((item) => {
      const card = document.createElement("div");
      card.className = "flex items-center justify-between m-5";

      const elItem = document.createElement("li");
      elItem.className = "my-2 font-semibold text-[20px] capitalize";
      elItem.textContent = `${item.id}. ${item.value}`;

      const span = document.createElement("span");
      span.className = "flex";

      const updateBtn = document.createElement("button");
      updateBtn.textContent = "Update";
      updateBtn.className =
        "ml-2 bg-blue-500 rounded-md text-white px-2 py-2 font-semibold";
      updateBtn.addEventListener("click", () => {
        if (elInput) {
          elInput.value = item.value;
        }
        editingId = item.id;
      });

      const deleteBtn = document.createElement("button");
      deleteBtn.textContent = "Delete";
      deleteBtn.className =
        "ml-2 bg-red-500 rounded-md text-white px-2 py-2 font-semibold";
      deleteBtn.addEventListener("click", () => deleteTodoItem(item.id));

      span.appendChild(updateBtn);
      span.appendChild(deleteBtn);

      card.appendChild(elItem);
      if (item.imageUrl) {
        const img = document.createElement("img");
        img.src = item.imageUrl;
        img.alt = "Todo Image";
        img.className = "w-16 h-16 object-cover ml-2";
        card.appendChild(img);
      }
      card.appendChild(span);
      elList.appendChild(card);
    });
  }
};

const updateTodoItem = (
  id: number,
  newValue: string,
  imageUrl?: string
): void => {
  const index = todoList.findIndex((item) => item.id === id);
  if (index !== -1) {
    todoList[index].value = newValue;
    if (imageUrl) {
      todoList[index].imageUrl = imageUrl;
    }
    SaveStorage("todo", todoList);
    renderTodo();
  }
};

const deleteTodoItem = (id: number): void => {
  const index = todoList.findIndex((item) => item.id === id);
  if (index !== -1) {
    todoList.splice(index, 1);
    SaveStorage("todo", todoList);
    renderTodo();
  }
};

renderTodo();
