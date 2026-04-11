from PIL import Image

def crop_transparency(img_path, out_path):
    img = Image.open(img_path)
    img = img.convert("RGBA")
    
    # Get the bounding box of non-transparent pixels
    bbox = img.getbbox()
    if bbox:
        # Add 5px padding if possible to prevent clipping
        padded_bbox = (
            max(0, bbox[0] - 5),
            max(0, bbox[1] - 5),
            min(img.width, bbox[2] + 5),
            min(img.height, bbox[3] + 5)
        )
        img = img.crop(padded_bbox)
        img.save(out_path, "PNG")
        print(f"Cropped to {padded_bbox}")
    else:
        print("No content found to crop")

crop_transparency("/Users/seandumont/Desktop/yourtopshop/public/images/brand/logo-new.png", "/Users/seandumont/Desktop/yourtopshop/public/images/brand/logo-new.png")
