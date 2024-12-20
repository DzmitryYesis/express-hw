const mockSendMail = jest.fn();

const createTransport = jest.fn(() => ({
    sendMail: mockSendMail,
}));

export { createTransport, mockSendMail };