import asyncio
from typing import List

import updater
from db import MongoDBConnection


async def main():
    collection_name: str = "cars"
    zip_file_name: str = "Monthly New Registration of Cars by Make.zip"
    zip_url: str = (
        f"https://datamall.lta.gov.sg/content/dam/datamall/datasets/Facts_Figures/Vehicle Registration/{zip_file_name}"
    )
    key_fields: List[str] = ["month"]

    db = MongoDBConnection().database
    collection = db[collection_name]

    # Create indexes
    collection.create_index({"month": 1, "make": 1})
    collection.create_index({"month": 1})
    collection.create_index({"make": 1})
    collection.create_index({"fuel_type": 1})
    collection.create_index({"make": 1, "fuel_type": 1})
    collection.create_index({"number": 1})

    db.client.close()

    return await updater.main(collection_name, zip_file_name, zip_url, key_fields)


def handler(event, context):
    print("Event:", event)
    response = asyncio.run(main())
    return {"statusCode": 200, "body": response}


if __name__ == "__main__":
    asyncio.run(main())
