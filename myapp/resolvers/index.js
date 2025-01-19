const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const Item = require('../models/item');
require('dotenv').config();

const generateToken = (user) => {
  return jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });

};

module.exports = {
  Query: {
    getShoppingList: async (_, __, context) => {
      if (!context.user) throw new Error('Not authenticated');
      return await Item.find({ userId: context.user.id });
    },
    getemail: async (_, { email }) => {
      const user = await User.findOne({ email });
      if (!user) throw new Error("User not found");
      return user;
    },
  checkItem: async (_, { id, userId }) => {
  // Check if the item exists for the user
  const item = await Item.findOne({ id, userId });
  return item; // Returns null if not found
    },
  getCartItems: async (_, { userId }) => {
      // Fetch cart items for a user
      const items = await Item.find({ userId });
      return items;
    },
  
  
},
    Mutation: {
      register: async (_, { username, email, password }) => {
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({ username, email, passwordHash: hashedPassword });
        const token = generateToken(user);
        return { id: user.id, username: user.username, email: user.email, token };
      },
      login: async (_, { email, password }) => {
        const user = await User.findOne({ email });
        if (!user) throw new Error('User not found');
        const isMatch = await bcrypt.compare(password, user.passwordHash);
        if (!isMatch) throw new Error('Invalid credentials');
        const token = generateToken(user);
      
        return { id: user.id, username: user.username, email: user.email, token };

      },
      addItem: async (_, { id, name, quantity, category, price, userId , imag }) => {
        const newItem = new Item({
          id,
          name,
          quantity,
          category,
          price, // Ensure price is being passed here
          userId,
          imag,
        });
        await newItem.save();
        return newItem;
      },
              updateItem: async(_, { id, quantity ,userId }
  ) =>{//}}, { user }) => {
    if (!userId) {
      throw new Error('You must be logged in to update an item');
    }

          // Find the item and update it

        const item = await Item.findOneAndUpdate(
          { id, userId }, // Ensure the item matches both the ID and userId
          { $set: { quantity:quantity} }, // Update only the quantity
          { new: true } // Return the updated item
        );

        if (!item) {
          throw new Error('Item not found or you are not authorized to update this item');
        }

        return item;
      }

      
    },
  }

