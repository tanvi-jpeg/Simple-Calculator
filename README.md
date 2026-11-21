# 🧮 WebCalc – Smart Calculator

A modern, responsive, full-stack web calculator built using HTML, CSS, JavaScript, Node.js, Express.js, and MongoDB. WebCalc performs mathematical calculations, stores calculation history, and allows users to search previous calculations using numbers or parts of expressions.

## 🌐 Live Demo

**[Open WebCalc – Smart Calculator](https://simple-calculator-4izp.onrender.com)**

## ✨ Features

- **Basic Arithmetic Operations:** Addition, subtraction, multiplication, and division.
- **Percentage Calculation:** Calculate percentages easily.
- **Parentheses Support:** Perform calculations using brackets.
- **Calculation History:** Automatically saves previous calculations in MongoDB.
- **Search History:** Search previous calculations using numbers or parts of expressions.
- **Clear History:** Delete all saved calculation records.
- **Restore Calculations:** Click a history item to restore its expression.
- **Keyboard Support:** Perform calculations using your keyboard.
- **Dark/Light Mode:** Switch between themes.
- **Responsive Design:** User-friendly interface for different screen sizes.
- **Persistent Storage:** Calculation history remains available after refreshing the page.

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| HTML5 | Structure of the application |
| CSS3 | Styling and responsive UI |
| JavaScript | Frontend functionality |
| Node.js | Backend runtime |
| Express.js | REST API and server |
| MongoDB Atlas | Cloud database |
| Mongoose | MongoDB object modeling |
| mathjs | Mathematical expression evaluation |
| dotenv | Environment variable management |
| Render | Application deployment |
| Git & GitHub | Version control and source code hosting |

## 📂 Project Structure

```text
Simple Calculator/
│
├── server.js
├── package.json
├── package-lock.json
├── .env
├── .gitignore
│
├── models/
│   └── Calculation.js
│
├── controllers/
│   └── calculatorController.js
│
├── routes/
│   └── calculatorRoutes.js
│
└── public/
    ├── index.html
    ├── css/
    │   └── style.css
    └── js/
        └── script.js
```

## ⚙️ Installation and Setup

### Prerequisites

Make sure you have installed:

- Node.js
- npm
- MongoDB Atlas account
- Git

### 1. Clone the Repository

```bash
git clone https://github.com/tanvi-jpeg/Simple-Calculator.git
```

### 2. Navigate to the Project Folder

```bash
cd Simple-Calculator
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Configure Environment Variables

Create a `.env` file in the root directory:

```env
MONGO_URI=your_mongodb_connection_string
PORT=5000
```

Replace the MongoDB URI with your actual MongoDB Atlas connection string.

**Important:** Never upload your `.env` file or database credentials to GitHub.

### 5. Start the Application

For development:

```bash
npm run dev
```

For production:

```bash
npm start
```

### 6. Open in Browser

```text
http://localhost:5000
```

## 🔌 API Endpoints

The application uses REST APIs to communicate between the frontend and backend.

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/calculate` | Evaluates an expression and saves the calculation |
| GET | `/api/history` | Retrieves previous calculations |
| DELETE | `/api/history` | Deletes all calculation history |

### Example Calculation Request

**POST** `/api/calculate`

```json
{
  "expression": "25+25"
}
```

### Example Response

```json
{
  "success": true,
  "result": "50"
}
```

## 🗄️ Database Design

WebCalc uses MongoDB Atlas to store calculation history.

Each calculation record contains:

| Field | Data Type | Description |
|---|---|---|
| expression | String | Mathematical expression entered |
| result | String | Calculated result |
| createdAt | Date | Date and time of calculation |

## 🚀 Deployment

The application is deployed using **Render**, with MongoDB Atlas as the cloud database.

Deployment architecture:

1. Source code is maintained on GitHub.
2. Render connects to the GitHub repository.
3. Render installs dependencies and runs the Node.js application.
4. MongoDB Atlas stores calculation history.
5. Users access the application through its public URL.

**Live Application:** https://simple-calculator-4izp.onrender.com

## 🔮 Future Enhancements

- Scientific calculator functions.
- Advanced mathematical operations.
- Export calculation history.
- Improved mobile interface.
- User accounts and personalized calculation history.

## 👩‍💻 Author

**Tanvi**

- GitHub: [@tanvi-jpeg](https://github.com/tanvi-jpeg)

## 📄 License

This project is developed for educational purposes as part of a Full Stack Web Development project.

---

⭐ If you find this project useful, consider giving the repository a star!
