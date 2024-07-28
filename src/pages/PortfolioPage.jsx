import { useState, useEffect } from "react";
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
} from "firebase/firestore";
import Modal from "react-bootstrap/Modal";
import Card from "react-bootstrap/Card";
import { auth } from "../firebase";
import { useAuth } from "../util/authContext";
import { db } from "../firebase";

const PortfolioPage = () => {
  const currentUser = useAuth();

  const userId = currentUser.user.uid;

  const [Portfolio, setPortfolio] = useState({
    title: "",
    description: "",
    link: "",
  });
  const [portfolioList, setPortfolioList] = useState([]);
  const [modalShow, setModalShow] = useState(false);
  const handleClose = () => setModalShow(false);
  const handleShow = () => setModalShow(true);

  const onChange = (e) => {
    const { name, value } = e.target;
    setPortfolio((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    await addPortfolio();
  };

  const addPortfolio = async () => {
    try {
      if (currentUser.isLoggedIn) {
        await addDoc(collection(db, `users/${userId}/portfolio`), Portfolio);
        setPortfolio({
          title: "",
          description: "",
          link: "",
        });
        handleClose();
        await getPortfolio(); // Fetch the updated portfolio list after adding
      }
    } catch (error) {
      console.error("Error adding document: ", error);
    }
  };

  const getPortfolio = async () => {
    const querySnapshot = await getDocs(
      collection(db, `users/${userId}/portfolio`)
    );
    const list = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setPortfolioList(list);
  };
  const handleDelete = async (id) => {
    await deleteDoc(doc(db, `users/${userId}/portfolio`, id));
    await getPortfolio();
  };

  useEffect(() => {
    getPortfolio();
    console.log(currentUser.isLoggedIn);
  }, []); // Removed portfolioList from dependency array to avoid infinite loop

  return (
    <div className="container mt-5 ">
      <h1 className="text-center">Portfolio</h1>
      <button type="button" className="btn btn-info m-3" onClick={handleShow}>
        Add Portfolio
      </button>

      <div className=" mt-2 d-flex">
        {portfolioList &&
          portfolioList?.map((portfolio) => (
            <Card className="border-primary col-3 m-3" key={portfolio.id}>
              <Card.Header className="border-primary bg-primary text-white ">
                {portfolio.title}
              </Card.Header>
              <div className="card-body">
                {" "}
                <p>{portfolio.description}</p>
                <a
                  href={portfolio.link}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Link
                </a>
              </div>
              <div className="card-footer d-flex justify-content-end">
                {" "}
                <button
                  onClick={() => handleDelete(portfolio.id)}
                  className="btn btn-danger "
                >
                  Delete
                </button>
              </div>
            </Card>
          ))}
      </div>

      <Modal
        onHide={handleClose}
        show={modalShow}
        aria-labelledby="contained-modal-title-vcenter p-5"
        centered
      >
        {" "}
        <Modal.Header className="modal-header">
          <h3>Add Portfolio</h3>
        </Modal.Header>
        <form className="form  p-5 " onSubmit={onSubmit}>
          <Modal.Body>
            <div className="form-group mb-2">
              <label htmlFor="title">Title</label>
              <input
                type="text"
                onChange={onChange}
                value={Portfolio.title}
                name="title"
                className="form-control"
              />
            </div>
            <div className="form-group mb-2">
              <label htmlFor="description">Description</label>
              <input
                type="text"
                onChange={onChange}
                value={Portfolio.description}
                name="description"
                className="form-control"
              />
            </div>
            <div className="form-group mb-2">
              <label htmlFor="link">Link</label>
              <input
                type="text"
                onChange={onChange}
                value={Portfolio.link}
                name="link"
                className="form-control"
              />
            </div>
            <Modal.Footer>
              <button type="submit" className="btn btn-primary  ">
                Add Portfolio
              </button>
              <button onClick={handleClose} className="btn btn-secondary">
                Close
              </button>
            </Modal.Footer>
          </Modal.Body>
        </form>
      </Modal>
    </div>
  );
};

export default PortfolioPage;
