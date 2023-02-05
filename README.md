# Captioned File (CPTN)

This repository defines an unofficial standard for a file format standard. Its main use is to create file that except their payload contain small pieces of text (captions) about that fil

## Overview

The CPTN file is a semi-binary file. That means that if you open it in a text editor, you would be seeing nonsense characters for the most part (except the magic number and the text caption). That is because a CPTN file contains both binary data (header and possibly the payload content) and text data (the payload except maybe the content)

## File format

The file consists of two parts: the header and the payload. The header is full of binary data, while the payload is full of text data (except the content, which can contain both/either binary and/or text data).

### Header

The header data are in the following format:

| Offset | Size | Name          | Description                                                                                   |
|--------|------|---------------|-----------------------------------------------------------------------------------------------|
| 0      | 5    | Magic number  | Magic number 0x4350544E0A (CPTN/n)                                                            |
| 5      | 1    | Filename size | Filename size in bytes or characters (it can also contain nothing, AKA 0x00 AKA a null byte)                    |
| 6      | 2    | Caption size  | Length of the caption text in bytes (max is 2^16 or about 65k, probably enough for a caption) |

### Payload

The payload data are in the following format:

| Size                                    | Name     | Description                                         |
|-----------------------------------------|----------|-----------------------------------------------------|
| Defined in file header as Filename size | Filename | Contains the filename of the original file (if any) |
| Defined in file header a Caption size   | Caption  | Contains the text caption of the file               |
| Remaining bytes of the file             | Content  | Contains the main content of the file               |

## Usage

This file format is intended to be used to add captions to already existing files, although it can also be used to generate new files
