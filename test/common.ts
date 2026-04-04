export function expectArrayContain(received: string[], expected: string[]) {
  if (received.length !== expected.length) {
    throw new Error(
      `Expected array length to be ${expected.length}, but received ${received.length}. Received: ${JSON.stringify(received)}`,
    );
  }
  for (let i = 0; i < received.length; i++) {
    let receivedItem = received[i];
    let expectedItem = expected[i];
    if (!receivedItem.includes(expectedItem)) {
      throw new Error(
        `Expected array to contain "${expectedItem}", but it was not found in "${receivedItem}". Received: ${JSON.stringify(received)}`,
      );
    }
  }
}
