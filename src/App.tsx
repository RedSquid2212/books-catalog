import './App.css';
import {Button} from 'antd';
import {AddBookModal} from "./components/AddBookModal/AddBookModal";
import {useState} from "react";

function App() {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <div className="App">
            <Button type={'primary'} onClick={() => setIsOpen(true)}>
                Add book
            </Button>
            <AddBookModal isOpen={isOpen} setIsOpen={setIsOpen} />
        </div>
    );
}

export default App;
