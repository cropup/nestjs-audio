interface AudioCreatedEventPayload {
  [key: string]: any;
}

export class AudioCreatedEvent {
  audioId: string;
  fileId: string;
  payload: AudioCreatedEventPayload;

  constructor(data: {
    audioId: string;
    fileId: string;
    payload: AudioCreatedEventPayload;
  }) {
    this.audioId = data.audioId;
    this.fileId = data.fileId;
    this.payload = data.payload;
  }
}
