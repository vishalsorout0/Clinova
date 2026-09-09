from pathlib import Path
import os

import fitz
import pytesseract
from PIL import Image


TESSERACT_CMD = os.getenv(
    "TESSERACT_CMD",
    r"C:\Program Files\Tesseract-OCR\tesseract.exe",
    
)

pytesseract.pytesseract.tesseract_cmd = TESSERACT_CMD


def extract_text_from_pdf(file_path: str) -> str:
    """
    Extract text from PDF.

    First tries normal PDF text extraction.
    If a page has no text, it renders that page as an image
    and performs OCR using Tesseract.
    """

    pdf_path = Path(file_path)

    if not pdf_path.exists():
        raise FileNotFoundError("PDF file not found")

    document = fitz.open(pdf_path)

    extracted_pages = []

    try:
        for page_number, page in enumerate(document):
            text = page.get_text("text").strip()

            if text:
                extracted_pages.append(
                    f"--- Page {page_number + 1} ---\n{text}"
                )
                continue

            # Scanned/image-based page
            pix = page.get_pixmap(
                matrix=fitz.Matrix(2, 2),
                alpha=False,
            )

            image = Image.frombytes(
                "RGB",
                [pix.width, pix.height],
                pix.samples,
            )

            ocr_text = pytesseract.image_to_string(
                image,
                lang="eng",
            ).strip()

            extracted_pages.append(
                f"--- Page {page_number + 1} ---\n{ocr_text}"
            )

    finally:
        document.close()

    return "\n\n".join(extracted_pages).strip()


def extract_text_from_image(file_path: str) -> str:
    """
    OCR for JPG, JPEG, PNG and WEBP images.
    """

    image_path = Path(file_path)

    if not image_path.exists():
        raise FileNotFoundError("Image file not found")

    image = Image.open(image_path)

    text = pytesseract.image_to_string(
        image,
        lang="eng",
    )

    return text.strip()


def extract_text_from_document(file_path: str) -> str:
    """
    Automatically selects the correct extraction method.
    """

    extension = Path(file_path).suffix.lower()

    if extension == ".pdf":
        return extract_text_from_pdf(file_path)

    if extension in {".jpg", ".jpeg", ".png", ".webp"}:
        return extract_text_from_image(file_path)

    raise ValueError("Unsupported document format")


def process_document_ocr(db, document):
    """
    Extract OCR/text and save it into the documents table.
    """

    extracted_text = extract_text_from_document(
        document.file_path
    )

    if not extracted_text:
        document.status = "ocr_empty"
        document.ocr_text = ""

    else:
        document.status = "ocr_completed"
        document.ocr_text = extracted_text

    db.commit()
    db.refresh(document)

    return document