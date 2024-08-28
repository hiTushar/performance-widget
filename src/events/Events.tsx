const generateEvent = (eventName: string, detail: any) => {
    const event = new CustomEvent(eventName, { detail });
    document.dispatchEvent(event);
}

export default generateEvent;
