const express = require("express");
const path = require("path");
const { open } = require("sqlite")
const sqlite3 = require("sqlite3")
const cors = require("cors")
const dbpath = path.join(__dirname, "sample.db")
const app = express()
app.use(express.json())
app.use(cors())

let db;

const initizedDBAndserver = async () => {
    try {
        db = await open({
            filename: dbpath,
            driver: sqlite3.Database,
        });
        app.listen(4000, () => {
            console.log("my server is running in 4000 port")
        })
    }
    catch (e) {
        console.log(e)
        process.exit(1);
    }
}

initizedDBAndserver();

app.get("/", async (request, response) => {
    const gettodosdata = `
        SELECT * FROM todos;
    `;
    const finalData = await db.all(gettodosdata)
    response.send(finalData);
})

app.post("/", async (request, response) => {
    const requestBody = request.body;
    const { title } = requestBody;
    const addTilte = `
        INSERT INTO todos 
            (title)
        VALUES ('${title}');
    `;
    const addData = await db.run(addTilte)
    const addedId = addData.lastID
    response.send({ addedId: addedId });
})

app.put("/:id", async (request, response) => {
    const { id } = request.params
    const updatedInfo = request.body
    const { title } = updatedInfo
    const updateData = `
        UPDATE todos
        SET
            title = '${title}'
        WHERE 
            id = ${id};
    `;
    await db.run(updateData)
    response.send("successfully updated")
})

app.delete("/:id", async (request, response) => {
    const { id } = request.params
    const deleteitem = `
        DELETE FROM todos
        WHERE id = ${id};
    `;
    await db.run(deleteitem)
    response.send({ message: 'Successfully deleted todo' });
});
