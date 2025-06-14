import asyncio, websockets, json, curses

async def connect(screen):
    uri = "ws://localhost:8080"
    async with websockets.connect(uri) as ws:
        await ws.send(json.dumps({ "type": "join", "room": "snake-room" }))
        screen.nodelay(True)

        async def send_input():
            while True:
                key = screen.getch()
                if key == curses.KEY_UP:
                    await ws.send(json.dumps({"type": "input", "direction": "UP"}))
                elif key == curses.KEY_DOWN:
                    await ws.send(json.dumps({"type": "input", "direction": "DOWN"}))
                elif key == curses.KEY_LEFT:
                    await ws.send(json.dumps({"type": "input", "direction": "LEFT"}))
                elif key == curses.KEY_RIGHT:
                    await ws.send(json.dumps({"type": "input", "direction": "RIGHT"}))
                await asyncio.sleep(0.05)

        async def receive_state():
            while True:
                try:
                    response = await ws.recv()
                    msg = json.loads(response)
                    if msg["type"] == "state":
                        state = msg["payload"]
                        screen.clear()

                        max_y, max_x = screen.getmaxyx()
                        w = state["boardSize"]["width"]
                        h = state["boardSize"]["height"]

                        # Draw borders
                        for y in range(h + 2):
                            for x in range(w + 2):
                                if y == 0 or y == h + 1 or x == 0 or x == w + 1:
                                    if 0 <= y < max_y and 0 <= x < max_x:
                                        screen.addstr(y, x, "#")

                        # Draw food
                        fx, fy = state["food"]["x"], state["food"]["y"]
                        if 0 <= fy + 1 < max_y and 0 <= fx + 1 < max_x:
                            screen.addstr(fy + 1, fx + 1, "@")

                        # Draw snakes
                        for snake in state["snakes"].values():
                            for segment in snake["body"]:
                                sx, sy = segment["x"], segment["y"]
                                if 0 <= sy + 1 < max_y and 0 <= sx + 1 < max_x:
                                    screen.addstr(sy + 1, sx + 1, "O")

                        screen.refresh()

                except Exception as e:
                    print(f"Error: {e}")
                    break


        await asyncio.gather(send_input(), receive_state())

def main():
    curses.wrapper(lambda screen: asyncio.run(connect(screen)))

if __name__ == "__main__":
    main()
