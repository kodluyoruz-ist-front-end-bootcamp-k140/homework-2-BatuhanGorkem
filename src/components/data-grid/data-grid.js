import React, { useEffect, useState } from "react";
import { Button } from "../button";
import { FormItem } from "../form-item";
import Pagination from "../Pagination";

export function DataGrid() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [todo, setTodo] = useState(null);
  const [postsPerPage, setPostsPage] = useState(20);
  const [order, setOrder] = useState("ASC");
  const [ıd, setId] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setLoading(true);
    fetch("https://jsonplaceholder.typicode.com/todos")
      .then((x) => x.json())
      .then((response) => {
        setItems(response);
        setLoading(false);
      })
      .catch((e) => {
        console.log(e);
        setLoading(false);
      });
  };

  //MEVCUT TODOlAR

  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = items.slice(indexOfFirstPost, indexOfLastPost);

  //PAGİNATİON
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  //STRİNG SORT ÖTNETİMİ
  const sorting = (col) => {
    if (order === "ASC") {
      const sorted = [...items].sort((a, b) =>
        a[col].toLowerCase() > b[col].toLowerCase() ? 1 : -1
      );
      setItems(sorted);
      setOrder("DSC");
    }
    if (order === "DSC") {
      const sorted = [...items].sort((a, b) =>
        a[col].toLowerCase() < b[col].toLowerCase() ? 1 : -1
      );
      setItems(sorted);
      setOrder("ASC");
    }
  };

  //TRUE VE FALSE İLE SORT YÖNETİMİ
  const onClickHandler = () => {
    setId((prev) => !prev);
  };

  const renderBody = () => {
    return (
      <React.Fragment>
        {currentPosts
          .sort((a, b) => (ıd ? a.id - b.id : b.id - a.id))

          .map((item, i) => {
            return (
              <tr key={i}>
                <th scope="row">{item.id}</th>
                <td>{item.title}</td>
                <td>{item.completed ? "Tamamlandı" : "Yapılacak"}</td>
                <td>
                  <Button
                    className="btn btn-xs btn-danger"
                    onClick={() => onRemove(item.id)}
                  >
                    Sil
                  </Button>
                  <Button
                    className="btn btn-xs btn-warning"
                    onClick={() => onEdit(item)}
                  >
                    Düzenle
                  </Button>
                </td>
              </tr>
            );
          })}
        <Pagination
          postsPerPage={postsPerPage}
          totalPosts={items.length}
          paginate={paginate}
        />
      </React.Fragment>
    );
  };

  const renderTable = () => {
    return (
      <>
        <Button onClick={onAdd}>Ekle</Button>
        <table className="table">
          <thead>
            <tr>
              <th onClick={onClickHandler} scope="col">
                #
              </th>
              <th onClick={() => sorting("title")} scope="col">
                Başlık
              </th>
              <th onClick={() => sorting("completed")} scope="col">
                Durum
              </th>
              <th scope="col">Aksiyonlar</th>
            </tr>
          </thead>
          <tbody>{renderBody()}</tbody>
        </table>
      </>
    );
  };

  const saveChanges = () => {
    // insert
    if (todo && todo.id === -1) {
      todo.id = Math.max(...items.map((item) => item.id)) + 1;
      setItems((items) => {
        items.push(todo);
        return [...items];
      });

      alert("Ekleme işlemi başarıyla gerçekleşti.");
      setTodo(null);
      return;
    }
    // update
    const index = items.findIndex((item) => item.id == todo.id);
    setItems((items) => {
      items[index] = todo;
      return [...items];
    });
    setTodo(null);
  };

  const onAdd = () => {
    setTodo({
      id: -1,
      title: "",
      completed: false,
    });
  };

  const onRemove = (id) => {
    const status = window.confirm("Silmek istediğinize emin misiniz?");

    if (!status) {
      return;
    }
    const index = items.findIndex((item) => item.id == id);

    setItems((items) => {
      items.splice(index, 1);
      return [...items];
    });
  };

  const onEdit = (todo) => {
    setTodo(todo);
  };

  const cancel = () => {
    setTodo(null);
  };

  const renderEditForm = () => {
    return (
      <>
        <FormItem
          title="Title"
          value={todo.title}
          onChange={(e) =>
            setTodo((todos) => {
              return { ...todos, title: e.target.value };
            })
          }
        />
        <FormItem
          component="checkbox"
          title="Completed"
          value={todo.completed}
          onChange={(e) =>
            setTodo((todos) => {
              return { ...todos, completed: e.target.checked };
            })
          }
        />
        <Button onClick={saveChanges}>Kaydet</Button>
        <Button className="btn btn-default" onClick={cancel}>
          Vazgeç
        </Button>
      </>
    );
  };

  return (
    <>{loading ? "Yükleniyor...." : todo ? renderEditForm() : renderTable()}</>
  );
}
