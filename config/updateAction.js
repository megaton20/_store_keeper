const db = require("../model/databaseTable");
const cron = require('node-cron');

const formatDate = (dateStr) => {
  const date = new Date(dateStr);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-based
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

const expiryChecker = () => {
  db.query(`SELECT * FROM inventory`, (err, results) => {
    if (err) {
      console.error("Error fetching inventory data:", err.sqlMessage);
      return;
    }

    let inventoryData = JSON.parse(JSON.stringify(results));

    inventoryData.forEach((inventory) => {
      inventory.created_date = formatDate(inventory.created_date);
      inventory.Manufacture_date = formatDate(inventory.Manufacture_date);
      inventory.Expire_date = formatDate(inventory.Expire_date);
    });

    const itemsWithDaysLeft = inventoryData.map((item) => {
      const today = new Date();
      const correctedExpireDate = new Date(formatDate(item.Expire_date));
      const timeDifference = correctedExpireDate.getTime() - today.getTime();
      const daysLeft = Math.ceil(timeDifference / (1000 * 3600 * 24));

      return { id: item.id, days_left: daysLeft };
    });

    const allInventory = inventoryData.map((item) => {
      const correspondingWatchData = itemsWithDaysLeft.find(watchItem => watchItem.id === item.id);
      return { ...item, watchData: correspondingWatchData };
    });

    allInventory.forEach(data => {
      if (data.watchData.days_left <= 0) {
        const itemId = data.id;

        const productQuery = `UPDATE Products SET status = 'expired' WHERE inventory_id = ?`;
        const inventoryQuery = `UPDATE inventory SET expired = 'expired' WHERE id = ?`;
        
        db.query(productQuery, [itemId], (err, result) => {
          if (err) {
            console.error(`Error updating product with ID ${itemId}:`, err.sqlMessage);
          } else {
            console.log(`Product with ID ${itemId} has been updated to expired.`);
          }
        });
        db.query(inventoryQuery, [itemId], (err, result) => {
          if (err) {
            console.error(`Error updating inventory with ID ${itemId}:`, err.sqlMessage);
          } else {
            console.log(`Inventory with ID ${itemId} has been updated to expired.`);
          }
        });
      }
    });
  });
};

// Schedule the job to run every minute
cron.schedule('* * * * *', () => {
    console.log('Running minute update job...');
    expiryChecker();
});

module.exports = expiryChecker;
