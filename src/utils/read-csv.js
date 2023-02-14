import fs from "node:fs";

import { parse } from "csv-parse";

const csvPath = new URL("../../tasks.csv", import.meta.url);

const stream = fs.createReadStream(csvPath);

const parsed = parse({
  delimiter: ",",
  from: "2",
});

async function bulkCreation() {
  const rows = stream.pipe(parsed);

  for await (const chunk of rows) {
    const [title, description] = chunk;

    await fetch('http://localhost:3333/tasks', {
      method: 'POST',
      headers: {
        'Content-type': 'application/json'
      },
      body: JSON.stringify({
        title,
        description,
      }),
    });
  }
}

bulkCreation();
