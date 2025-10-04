# Todo App - Node.js & Express.js

A simple, elegant todo application built with Node.js and Express.js featuring a RESTful API and a clean web interface.

## Features

- ✅ Create, read, update, and delete todos
- ✅ Mark todos as completed/uncompleted
- ✅ RESTful API endpoints
- ✅ Responsive web interface
- ✅ In-memory data storage
- ✅ Input validation and error handling
- ✅ Modern JavaScript (ES6+)

## Project Structure

```
todo-express-node/
├── public/
│   ├── index.html      # Main HTML file
│   ├── style.css       # Styles for the frontend
│   └── script.js       # Frontend JavaScript
├── .github/
│   └── copilot-instructions.md
├── server.js           # Express.js server
├── package.json        # Node.js dependencies and scripts
└── README.md          # This file
```

## API Endpoints

- `GET /api/todos` - Get all todos
- `GET /api/todos/:id` - Get a specific todo by ID
- `POST /api/todos` - Create a new todo
- `PUT /api/todos/:id` - Update a todo
- `DELETE /api/todos/:id` - Delete a todo

### API Usage Examples

**Get all todos:**
```bash
curl http://localhost:3000/api/todos
```

**Create a new todo:**
```bash
curl -X POST http://localhost:3000/api/todos \
  -H "Content-Type: application/json" \
  -d '{"title": "Buy groceries"}'
```

**Update a todo:**
```bash
curl -X PUT http://localhost:3000/api/todos/[todo-id] \
  -H "Content-Type: application/json" \
  -d '{"completed": true}'
```

**Delete a todo:**
```bash
curl -X DELETE http://localhost:3000/api/todos/[todo-id]
```

## Installation & Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start the development server:**
   ```bash
   npm run dev
   ```
   Or for production:
   ```bash
   npm start
   ```

3. **Open your browser:**
   Navigate to `http://localhost:3000`

## Scripts

- `npm start` - Start the production server
- `npm run dev` - Start the development server with nodemon (auto-restart)

## Technologies Used

- **Backend:** Node.js, Express.js
- **Frontend:** Vanilla HTML, CSS, JavaScript
- **Dependencies:** 
  - `express` - Web framework
  - `cors` - Cross-origin resource sharing
  - `uuid` - Generate unique IDs
- **Dev Dependencies:**
  - `nodemon` - Development server with auto-reload

## Development Guidelines

- Use ES6+ JavaScript features
- Follow REST API conventions
- Keep code modular and well-documented
- Implement proper error handling
- Validate user input

## Future Enhancements

- Database integration (MongoDB, PostgreSQL, etc.)
- User authentication and authorization
- Todo categories and tags
- Due dates and reminders
- Search and filtering
- Export/import functionality
- Dark mode theme

## License

MIT License - feel free to use this project for learning and development purposes.