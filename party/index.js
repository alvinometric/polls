export default class PollParty {
  constructor(party) {
    this.party = party;
    this.votes = {};
  }
  async onStart() {
    this.votes = (await this.party.storage.get("votes")) || {};
  }
  async onConnect(connection) {
    const msg = {
      type: "sync",
      votes: this.votes,
    };
    connection.send(JSON.stringify(msg));
  }
  async onMessage(message) {
    const msg = JSON.parse(message);
    if (msg.type === "vote") {
      const { option } = msg;
      this.votes[option] = (parseInt(`${this.votes[option]}`) || 0) + 1;
      this.party.broadcast(JSON.stringify({ type: "sync", votes: this.votes }));
      await this.party.storage.put("votes", this.votes);
    }
  }
}
