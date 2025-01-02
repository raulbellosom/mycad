import { db } from "../lib/db.js";

export const parseStatus = (status) => status == "true" || status == true;

export const getVehicles = async (req, res) => {
  try {
    const vehicles = await db.vehicle.findMany({
      where: { enabled: true },
      include: {
        model: {
          include: {
            brand: true,
            type: true,
          },
        },
        conditions: {
          include: {
            condition: true,
          },
        },
        files: true,
        images: {
          where: { enabled: true },
          select: {
            url: true,
            type: true,
            thumbnail: true,
            metadata: true,
          },
        },
      },
    });
    res.json(vehicles);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: error.message });
  }
};

export const getVehicleById = async (req, res) => {
  const { id } = req.params;

  try {
    const vehicle = await db.vehicle.findUnique({
      where: { id },
      include: {
        model: {
          include: {
            brand: true,
            type: true,
          },
        },
        conditions: {
          include: {
            condition: true,
          },
        },
        files: {
          where: { enabled: true },
          select: {
            id: true,
            url: true,
            type: true,
            metadata: true,
          },
        },
        images: {
          where: { enabled: true },
          select: {
            id: true,
            url: true,
            type: true,
            thumbnail: true,
            metadata: true,
          },
        },
      },
    });

    if (vehicle) {
      vehicle.acquisitionDate
        ? (vehicle.acquisitionDate = vehicle.acquisitionDate
            .toISOString()
            .split("T")[0])
        : null;
      res.json(vehicle);
    } else {
      console.log("Vehicle not found");
      res.status(404).json({ message: "Vehicle not found" });
    }
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: error.message });
  }
};

export const createVehicle = async (req, res) => {
  try {
    const { vehicle } = req.body;
    const user = req.user;
    const vehicleData = JSON.parse(vehicle);
    const {
      modelId,
      acquisitionDate,
      cost,
      costCurrency,
      bookValue,
      bookValueCurrency,
      currentMarketValue,
      marketValueCurrency,
      mileage,
      status,
      comments,
      conditions,
      plateNumber,
      economicNumber,
      serialNumber,
    } = vehicleData;

    const createdVehicle = await db.$transaction(async (prisma) => {
      const vehicle = await prisma.vehicle.create({
        data: {
          modelId: parseInt(modelId, 10),
          plateNumber,
          economicNumber,
          serialNumber,
          acquisitionDate: new Date(acquisitionDate),
          cost: cost || null,
          costCurrency,
          bookValue: bookValue || null,
          bookValueCurrency,
          currentMarketValue: currentMarketValue || null,
          marketValueCurrency,
          mileage,
          status: parseStatus(status),
          createdById: user.id,
          comments,
          enabled: true,
        },
        include: {
          model: {
            include: {
              brand: true,
              type: true,
            },
          },
          conditions: {
            include: {
              condition: true,
            },
          },
          images: true,
          files: true,
        },
      });

      if (conditions && conditions.length > 0) {
        const conditionData = conditions.map((conditionId) => ({
          vehicleId: vehicle.id,
          conditionId: parseInt(conditionId, 10),
        }));

        await prisma.vehicleCondition.createMany({
          data: conditionData,
        });
      }

      if (req.processedFiles && req.processedFiles.length > 0) {
        const imageData = req.processedFiles.map((file) => ({
          url: file.url,
          type: file.type,
          thumbnail: file.thumbnail,
          vehicleId: vehicle.id,
          enabled: true,
        }));

        await prisma.image.createMany({
          data: imageData,
        });
      }

      if (req.files && req.files.length > 0) {
        const fileData = req.files.map((file) => ({
          url: file.url,
          type: file.type,
          vehicleId: vehicle.id,
          metadata: file.metadata,
          enabled: true,
        }));

        await prisma.file.createMany({
          data: fileData,
        });
      }

      return vehicle;
    });

    res.status(201).json(createdVehicle);
  } catch (error) {
    console.error("Error creating vehicle:", error.message);
    res.status(500).json({ message: "Failed to create vehicle" });
  } finally {
    await db.$disconnect();
  }
};

export const updateVehicle = async (req, res) => {
  const { id } = req.params;
  const {
    modelId,
    acquisitionDate,
    cost,
    costCurrency,
    bookValue,
    bookValueCurrency,
    currentMarketValue,
    marketValueCurrency,
    mileage,
    status,
    comments,
    conditions,
    plateNumber,
    economicNumber,
    serialNumber,
    images,
    files,
  } = JSON.parse(req.body.vehicle || "{}");

  try {
    const model = await db.model.findUnique({
      where: { id: parseInt(modelId, 10) },
    });

    if (!model) {
      res.status(404).json({ message: "Model not found" });
      return;
    }

    await db.$transaction(async (prisma) => {
      await prisma.vehicle.update({
        where: { id },
        data: {
          modelId: parseInt(modelId, 10),
          plateNumber,
          economicNumber,
          serialNumber,
          acquisitionDate: new Date(acquisitionDate),
          cost,
          costCurrency,
          bookValue,
          bookValueCurrency,
          currentMarketValue,
          marketValueCurrency,
          mileage,
          status: parseStatus(status),
          comments,
        },
      });

      if (conditions && conditions.length > 0) {
        await prisma.vehicleCondition.deleteMany({
          where: { vehicleId: id },
        });

        const conditionData = conditions.map((conditionId) => ({
          vehicleId: id,
          conditionId: parseInt(conditionId, 10),
        }));

        await prisma.vehicleCondition.createMany({
          data: conditionData,
        });
      }

      const currentImages = new Set();
      images.forEach((element) => {
        if (element.id) {
          currentImages.add(element.id);
        }
      });

      await prisma.image.updateMany({
        where: {
          vehicleId: id,
          id: { notIn: Array.from(currentImages) },
        },
        data: { enabled: false },
      });

      if (req.processedFiles && req.processedFiles.length > 0) {
        const imageData = req.processedFiles.map((file) => ({
          url: file.url,
          type: file.type,
          thumbnail: file.thumbnail,
          vehicleId: id,
          metadata: file.metadata,
          enabled: true,
        }));

        await prisma.image.createMany({
          data: imageData,
        });
      }

      const currentFiles = new Set();
      files.forEach((element) => {
        if (element.id) {
          currentFiles.add(element.id);
        }
      });

      await prisma.file.updateMany({
        where: {
          vehicleId: id,
          id: { notIn: Array.from(currentFiles) },
        },
        data: { enabled: false },
      });

      if (req.files && req.files.length > 0) {
        const fileData = req.files.map((file) => ({
          url: file.url,
          type: file.type,
          vehicleId: id,
          metadata: file.metadata,
          enabled: true,
        }));

        await prisma.file.createMany({
          data: fileData,
        });
      }
    });

    const updatedVehicle = await db.vehicle.findUnique({
      where: { id },
      include: {
        model: {
          include: {
            brand: true,
            type: true,
          },
        },
        conditions: {
          include: {
            condition: true,
          },
        },
        images: {
          where: { enabled: true },
          select: {
            id: true,
            url: true,
            type: true,
            thumbnail: true,
            metadata: true,
          },
        },
        files: {
          where: { enabled: true },
          select: {
            id: true,
            url: true,
            type: true,
            metadata: true,
          },
        },
      },
    });

    if (updatedVehicle) {
      updatedVehicle.acquisitionDate
        ? (updatedVehicle.acquisitionDate = updatedVehicle.acquisitionDate
            .toISOString()
            .split("T")[0])
        : null;
    }

    res.json(updatedVehicle);
  } catch (error) {
    console.error("Error updating vehicle:", error.message);
    res.status(500).json({ message: "Failed to update vehicle" });
  } finally {
    await db.$disconnect();
  }
};

export const deleteVehicle = async (req, res) => {
  const { id } = req.params;

  try {
    await db.vehicle.update({
      where: { id },
      data: { enabled: false },
    });

    const vehicles = await db.vehicle.findMany({
      where: { id: { not: id }, enabled: true },
      include: {
        model: {
          include: {
            brand: true,
            type: true,
          },
        },
        conditions: {
          include: {
            condition: true,
          },
        },
      },
    });

    res.json({ data: vehicles, message: "Vehicle deleted" });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: error.message });
  }
};

export const searchVehicles = async (req, res) => {
  try {
    const {
      searchTerm,
      sortBy = "createdAt",
      order = "asc",
      page = 1,
      pageSize = 10,
      conditionName,
      deepSearch = [],
    } = req.query;

    const validSortFields = [
      "createdAt",
      "cost",
      "mileage",
      "status",
      "model.name",
      "model.brand.name",
      "model.type.name",
      "model.type.economicGroup",
      "model.year",
      "economicNumber",
      "plateNumber",
      "serialNumber",
    ];

    const mapSearchHeaderToColumn = (searchHeader) => {
      const columnsMap = {
        "model.name": "model.name",
        "model.type.name": "model.type.name",
        "model.type.economicGroup": "model.type.economicGroup",
        "model.brand.name": "model.brand.name",
        "model.year": "model.year",
        economicNumber: "economicNumber",
        serialNumber: "serialNumber",
        plateNumber: "plateNumber",
        acquisitionDate: "acquisitionDate",
        cost: "cost",
      };
      return columnsMap[searchHeader] || null;
    };

    const buildDeepSearchConditions = (deepSearchArray) => {
      const conditions = [];

      deepSearchArray.forEach(
        ({ searchHeader, searchTerm, searchCriteria }) => {
          const column = mapSearchHeaderToColumn(searchHeader);

          if (!column || typeof column !== "string") return;

          const path = column.split(".");
          let condition = {};

          switch (searchCriteria) {
            case "equals":
              condition = { [path[path.length - 1]]: { equals: searchTerm } };
              break;
            case "startsWith":
              condition = {
                [path[path.length - 1]]: { startsWith: searchTerm },
              };
              break;
            case "endsWith":
              condition = {
                [path[path.length - 1]]: { endsWith: searchTerm },
              };
              break;
            case "contains":
              condition = { [path[path.length - 1]]: { contains: searchTerm } };
              break;
            case "different":
              condition = { [path[path.length - 1]]: { not: searchTerm } };
              break;
            case "greater":
              condition = {
                [path[path.length - 1]]: { gt: Number(searchTerm) },
              };
              break;
            case "less":
              condition = {
                [path[path.length - 1]]: { lt: Number(searchTerm) },
              };
              break;
            case "before":
              condition = {
                [path[path.length - 1]]: { lt: new Date(searchTerm) },
              };
              break;
            case "after":
              condition = {
                [path[path.length - 1]]: { gt: new Date(searchTerm) },
              };
              break;
            default:
              break;
          }

          let nestedCondition = condition;
          for (let i = path.length - 2; i >= 0; i--) {
            nestedCondition = { [path[i]]: nestedCondition };
          }

          conditions.push(nestedCondition);
        }
      );

      return conditions.length > 0 ? { AND: conditions } : {};
    };

    const orderField = validSortFields.includes(sortBy) ? sortBy : "createdAt";
    const orderDirection = order === "desc" ? "desc" : "asc";

    const formSortBy = (value, order) => {
      let arr = value.split(".");
      let obj = {};
      if (arr.length === 3) {
        obj = {
          [arr[0]]: {
            [arr[1]]: {
              [arr[2]]: order,
            },
          },
        };
      } else if (arr.length === 2) {
        obj = {
          [arr[0]]: {
            [arr[1]]: order,
          },
        };
      } else {
        obj = {
          [arr[0]]: order,
        };
      }
      return obj;
    };

    const textSearchConditions = searchTerm
      ? {
          OR: [
            { model: { name: { contains: searchTerm } } },
            { model: { brand: { name: { contains: searchTerm } } } },
            { model: { type: { name: { contains: searchTerm } } } },
            { model: { type: { economicGroup: { contains: searchTerm } } } },
            { economicNumber: { contains: searchTerm } },
            { plateNumber: { contains: searchTerm } },
            { serialNumber: { contains: searchTerm } },
            { comments: { contains: searchTerm } },
          ],
        }
      : {};

    const deepSearchConditions = buildDeepSearchConditions(
      JSON?.parse(deepSearch)
    );

    const skip = (page - 1) * pageSize;
    const take = parseInt(pageSize);
    const whereConditions = {
      ...textSearchConditions,
      ...deepSearchConditions,
      enabled: true,
      ...(conditionName && {
        conditions: {
          some: {
            condition: {
              name: {
                in: Array.isArray(conditionName)
                  ? conditionName
                  : [conditionName],
              },
            },
          },
        },
      }),
    };

    const vehicles = await db.vehicle.findMany({
      where: whereConditions,
      include: {
        model: {
          include: {
            brand: true,
            type: true,
          },
        },
        conditions: {
          include: {
            condition: true,
          },
        },
        images: {
          where: { enabled: true },
        },
        files: {
          where: { enabled: true },
        },
      },
      orderBy: formSortBy(orderField, orderDirection),
      skip,
      take,
    });

    const totalRecords = await db.vehicle.count({
      where: whereConditions,
    });

    const totalPages = Math.ceil(totalRecords / pageSize);

    let vehiclesData = {};
    if (vehicles) {
      vehiclesData = vehicles.map((vehicle) => {
        vehicle.acquisitionDate
          ? (vehicle.acquisitionDate = vehicle.acquisitionDate
              .toISOString()
              .split("T")[0])
          : null;
        return vehicle;
      });
    }
    res.json({
      data: vehiclesData,
      pagination: {
        totalRecords,
        totalPages,
        currentPage: parseInt(page),
        pageSize: parseInt(pageSize),
      },
    });
  } catch (error) {
    console.error("Error fetching vehicles:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
