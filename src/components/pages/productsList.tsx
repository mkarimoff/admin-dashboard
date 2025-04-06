import Table from "@mui/joy/Table";
import Sheet from "@mui/joy/Sheet";
import { Box, Button, Input, Modal, ModalDialog, Typography } from "@mui/joy";
import Select, { selectClasses } from "@mui/joy/Select";
import Option from "@mui/joy/Option";
import KeyboardArrowDown from "@mui/icons-material/KeyboardArrowDown";
import { Link } from "react-router-dom";
import { Container, ProductModal } from "../styles";
import React from "react";

function createData(
  name: string,
  calories: number,
  fat: number,
  carbs: number,
  protein: number
) {
  return { name, calories, fat, carbs, protein };
}

const rows = [
  createData("Frozen yoghurt", 159, 6.0, 24, 4.0),
  createData("Ice cream sandwich", 237, 9.0, 37, 4.3),
  createData("Eclair", 262, 16.0, 24, 6.0),
  createData("Cupcake", 305, 3.7, 67, 4.3),
  createData("Gingerbread", 356, 16.0, 49, 3.9),
];

const ProductsList = () => {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const [imagePreviews, setImagePreviews] = React.useState<string[]>(
    Array(4).fill("https://via.placeholder.com/150")
  );

  return (
    <Container>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Typography sx={{ paddingY: 2, fontSize: 30 }}>
          Products List
        </Typography>
        <Box sx={{ display: "flex", gap: 2 }}>
          <Button color="success">Download Excel</Button>
          <Link to={`/add-new-product`} style={{ textDecoration: "none" }}>
            <Button>Add New Product</Button>
          </Link>
        </Box>
      </Box>

      <Box
        sx={{
          display: "flex",
          gap: 2,
          justifyContent: "end",
          mb: 4,
          alignItems: "center",
        }}
      >
        <Input placeholder="Search in here…" sx={{ flex: 2 }} />
        <Select
          placeholder="Category"
          indicator={<KeyboardArrowDown />}
          sx={{
            flex: 2,
            [`& .${selectClasses.indicator}`]: {
              transition: "0.2s",
              [`&.${selectClasses.expanded}`]: {
                transform: "rotate(-180deg)",
              },
            },
          }}
        >
          <Option value="chair">Chair</Option>
          <Option value="drawer">Drawer</Option>
          <Option value="table">Table</Option>
          <Option value="sofa">Sofa</Option>
        </Select>
        <Select
          placeholder="Price"
          indicator={<KeyboardArrowDown />}
          sx={{
            flex: 1,
            [`& .${selectClasses.indicator}`]: {
              transition: "0.2s",
              [`&.${selectClasses.expanded}`]: {
                transform: "rotate(-180deg)",
              },
            },
          }}
        >
          <Option value="dog">Dog</Option>
          <Option value="cat">Cat</Option>
          <Option value="fish">Fish</Option>
          <Option value="bird">Bird</Option>
        </Select>

        <Button>FILTER</Button>
        <Button variant="soft">RESET</Button>
      </Box>

      <Sheet variant="soft" sx={{ pt: 1, borderRadius: "sm" }}>
        <Table
          stripe="odd"
          hoverRow
          sx={{
            captionSide: "top",
            "& tbody": { bgcolor: "background.surface" },
          }}
        >
          <thead>
            <tr>
              <th style={{ width: "60px" }}>No</th>
              <th style={{ width: "25%" }}>Title</th>
              <th>image</th>
              <th>price</th>
              <th>type</th>
              <th style={{ width: "60px" }}></th>
              <th style={{ width: "60px" }}></th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.name}>
                <td>1</td>
                <td>{row.name}</td>
                <td>{row.calories}</td>
                <td>{row.fat}$</td>
                <td>{row.carbs}</td>
                <td>
                  <div>
                    <Typography
                      color="primary"
                      sx={{ cursor: "pointer" }}
                      onClick={handleOpen}
                    >
                      Edit
                    </Typography>
                    <Modal
                      open={open}
                      onClose={handleClose}
                      slotProps={{
                        backdrop: {
                          sx: {
                            backgroundColor: "rgba(255, 255, 255, 0.03)",
                            backdropFilter: "blur(2px)",
                          },
                        },
                      }}
                    >
                      <ModalDialog
                        sx={{
                          position: "absolute",
                          top: "50%",
                          left: "50%",
                          transform: "translate(-30%, -50%)",
                          width: 800,
                          bgcolor: "white",
                          border: "1px solid #000",
                          p: 10,
                        }}
                      >
                        <Typography
                          level="h4"
                          component="h2"
                          sx={{ marginLeft: "-35px" }}
                        >
                          Edit product
                        </Typography>

                        <div
                          style={{
                            display: "flex",
                            gap: "10px",
                            marginLeft: "-35px",
                          }}
                        >
                          {[0, 1, 2, 3].map((index) => (
                            <div
                              key={index}
                              style={{
                                position: "relative",
                                width: "80px",
                                height: "80px",
                                border: "2px dashed #ccc",
                                borderRadius: "12px",
                                cursor: "pointer",
                                overflow: "hidden",
                                marginTop: "10px",
                              }}
                              onClick={() =>
                                document
                                  .getElementById(`image-upload-${index}`)
                                  ?.click()
                              }
                            >
                              {index === 0 && (
                                <div
                                  style={{
                                    position: "absolute",
                                    top: "4px",
                                    left: "4px",
                                    backgroundColor: "#1976d2",
                                    color: "white",
                                    fontSize: "10px",
                                    padding: "2px 6px",
                                    borderRadius: "4px",
                                    zIndex: 2,
                                  }}
                                >
                                  Main
                                </div>
                              )}
                              <input
                                type="file"
                                id={`image-upload-${index}`}
                                accept="image/*"
                                onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  if (file) {
                                    const reader = new FileReader();
                                    reader.onloadend = () => {
                                      setImagePreviews((prev) => {
                                        const updated = [...prev];
                                        updated[index] = reader.result as string;
                                        return updated;
                                      });
                                    };
                                    reader.readAsDataURL(file);
                                  }
                                }}
                                style={{ display: "none" }}
                              />
                              <img
                                src={imagePreviews[index]}
                                style={{
                                  width: "100%",
                                  height: "100%",
                                  objectFit: "cover",
                                }}
                              />
                            </div>
                          ))}
                        </div>

                        <ProductModal>
                          <div className="inputs-con">
                            <div className="inputs-wrap">
                              <input type="text" placeholder="Title" />
                              <input type="text" placeholder="Price" />
                              <input type="text" placeholder="Description" />
                            </div>
                            <div className="inputs-wrap">
                              <input type="number" placeholder="Discount" />
                              <input type="number" placeholder="Quantity" />
                              <select>
                                <option value="" disabled selected hidden>
                                  Type
                                </option>
                                <option value="chair">Chair</option>
                                <option value="drawer">Drawer</option>
                                <option value="sofa">Sofa</option>
                                <option value="table">Table</option>
                              </select>
                            </div>
                          </div>
                        </ProductModal>

                        <Typography
                          sx={{
                            mt: 2,
                            display: "flex",
                            gap: "10px",
                            marginLeft: "530px",
                          }}
                        >
                          <Button color="success" onClick={handleClose}>
                            Cancel
                          </Button>
                          <Button>Edit</Button>
                        </Typography>
                      </ModalDialog>
                    </Modal>
                  </div>
                </td>
                <td>
                  <Link to={":id"} style={{ textDecoration: "none" }}>
                    <Typography color="primary" sx={{ cursor: "pointer" }}>
                      View
                    </Typography>
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Sheet>
    </Container>
  );
};

export default ProductsList;

