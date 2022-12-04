import {FastifyInstance} from "fastify";
import {Readable} from "stream";


export function initPeopleRoute(server: FastifyInstance) {
    server.get('/string-people', async (request, reply) => {
        const exampleStream = new Readable()
        exampleStream.push('[\n');
        exampleStream.push('  {"name": "Alex"},\n');
        exampleStream.push('  {"name": "Taylor"}\n');
        exampleStream.push(']\n');
        exampleStream.push(null);

        reply
            .type('application/json')
            .send(exampleStream);
    });

    server.get('/json-people', async (request, reply) => {
        const exampleStream = new Readable()
        exampleStream.push([{name: "Alex"}, {name: "Taylor"}]);
        exampleStream.push(null);

        reply
            .type('application/json')
            .send(exampleStream);
    });
}

