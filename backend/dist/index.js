"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const body_parser_1 = __importDefault(require("body-parser"));
const path_1 = __importDefault(require("path"));
const dotenv_1 = __importDefault(require("dotenv"));
const file_routes_1 = require("./routes/file.routes");
const block_routes_1 = require("./routes/block.routes");
const category_routes_1 = require("./routes/category.routes");
// Load environment variables
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3001;
// Middleware
app.use((0, cors_1.default)());
app.use(body_parser_1.default.json());
app.use(body_parser_1.default.urlencoded({ extended: true }));
// Static files
app.use('/uploads', express_1.default.static(path_1.default.join(__dirname, '../uploads')));
// Routes
app.use('/api', file_routes_1.fileRouter);
app.use('/api', block_routes_1.blockRouter);
app.use('/api', category_routes_1.categoryRouter);
// Basic route for testing
app.get('/', (req, res) => {
    res.send('CAD Blocks API is running!');
});
// Start server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
