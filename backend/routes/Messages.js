import express from 'express'
import { getMessages, SendMessage, toggleHeart, editMessage, deleteMessage, setEmoji, handleLastMessages } from '../controllers/Message.js'
import { upload } from '../middleware/Multer.js'
import { deleteMsgIdValidator, editMsgValidator, emojiValidator, sendMessageValidator, toggledHeartValidator } from '../middleware/Validators.js'
import { validate } from '../middleware/Validate.js'

const MessageRoutes = express.Router()

MessageRoutes.post('/send_message', upload.single("file"), SendMessage)
MessageRoutes.post('/get_messages', getMessages)
MessageRoutes.post('/toggle-heart', toggledHeartValidator, validate, toggleHeart)
MessageRoutes.post('/edit-message', editMsgValidator, validate, editMessage)
MessageRoutes.post('/delete-message', deleteMsgIdValidator, validate, deleteMessage)
MessageRoutes.post('/set-emoji', emojiValidator, validate, setEmoji)
MessageRoutes.post('/get-last-messages', handleLastMessages)


export default MessageRoutes