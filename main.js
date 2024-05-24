"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const SaveStorage = (key, data) => {
    window.localStorage.setItem(key, JSON.stringify(data));
};
const GetDataStorage = (key) => {
    const data = window.localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
};
const elForm = document.querySelector(".todo-form");
const elList = document.querySelector(".todo-list");
const elInput = document.querySelector(".todo-input");
const elImageInput = document.querySelector(".todo-image-input");
const todoList = GetDataStorage("todo") || [];
let editingId = null;
elForm === null || elForm === void 0 ? void 0 : elForm.addEventListener("submit", (e) => __awaiter(void 0, void 0, void 0, function* () {
    e.preventDefault();
    if (elInput && elInput.value.trim() !== "") {
        let imageUrl;
        if (elImageInput && elImageInput.files && elImageInput.files[0]) {
            imageUrl = yield uploadImage(elImageInput.files[0]);
        }
        if (editingId !== null) {
            updateTodoItem(editingId, elInput.value, imageUrl);
            editingId = null;
        }
        else {
            const newObj = {
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
}));
const uploadImage = (file) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
            resolve(reader.result);
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
};
const renderTodo = () => {
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
const updateTodoItem = (id, newValue, imageUrl) => {
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
const deleteTodoItem = (id) => {
    const index = todoList.findIndex((item) => item.id === id);
    if (index !== -1) {
        todoList.splice(index, 1);
        SaveStorage("todo", todoList);
        renderTodo();
    }
};
renderTodo();
