from PIL import Image

def make_transparent(img_path, out_path):
    img = Image.open(img_path)
    img = img.convert("RGBA")
    datas = img.getdata()
    
    newData = []
    # Strip near-white background
    for item in datas:
        # Check if pixel is white or near white (r, g, b > 240)
        if item[0] > 240 and item[1] > 240 and item[2] > 240:
            newData.append((255, 255, 255, 0)) # transparent
        else:
            newData.append(item)
            
    img.putdata(newData)
    img.save(out_path, "PNG")

make_transparent("/Users/seandumont/.gemini/antigravity/brain/9dc10868-d50c-4351-a8ac-be01e3d4b50f/media__1775756838627.png", "/Users/seandumont/Desktop/yourtopshop/public/images/brand/logo-new.png")
print("Done!")
