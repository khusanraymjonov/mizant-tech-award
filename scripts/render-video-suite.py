from __future__ import annotations

import argparse
import json
import subprocess
from pathlib import Path

from PIL import Image, ImageDraw, ImageEnhance, ImageFilter, ImageFont


NAVY = "#0B2B3C"
TEAL = "#0B8A72"
GOLD = "#D6A94A"
IVORY = "#F6F7F3"
WHITE = "#FFFFFF"
MINT = "#C7D8D3"
MUTED = "#AFC1C8"


def run(command: list[str]) -> None:
    subprocess.run(command, check=True)


def font(path: str, size: int) -> ImageFont.FreeTypeFont:
    return ImageFont.truetype(path, size)


def wrap(draw: ImageDraw.ImageDraw, text: str, selected_font, max_width: int) -> list[str]:
    words = text.split()
    lines: list[str] = []
    line = ""
    for word in words:
        candidate = f"{line} {word}".strip()
        if draw.textbbox((0, 0), candidate, font=selected_font)[2] <= max_width:
            line = candidate
        else:
            if line:
                lines.append(line)
            line = word
    if line:
        lines.append(line)
    return lines


def draw_logo(canvas: Image.Image, logo_path: Path, x: int, y: int, width: int) -> None:
    logo = Image.open(logo_path).convert("RGBA")
    height = round(width * logo.height / logo.width)
    logo = logo.resize((width, height), Image.Resampling.LANCZOS)
    canvas.alpha_composite(logo, (x, y))


def make_card(
    output: Path,
    logo_path: Path,
    title: str,
    subtitle: str,
    eyebrow: str,
    disclaimer: str,
    closing: bool = False,
) -> None:
    canvas = Image.new("RGBA", (1920, 1080), NAVY)
    draw = ImageDraw.Draw(canvas)
    bold = "C:/Windows/Fonts/seguisb.ttf"
    regular = "C:/Windows/Fonts/segoeui.ttf"

    draw.rectangle((0, 0, 18, 1080), fill=TEAL)
    draw.rectangle((18, 0, 24, 1080), fill=GOLD)
    draw.rounded_rectangle((1390, -150, 2050, 510), radius=90, fill="#103848")
    draw.rounded_rectangle((1510, 20, 1970, 480), radius=70, outline=TEAL, width=4)
    draw_logo(canvas, logo_path, 120, 92, 340)

    eyebrow_font = font(bold, 25)
    title_font = font(bold, 72 if not closing else 66)
    subtitle_font = font(regular, 34)
    footer_font = font(regular, 20)

    draw.text((120, 315), eyebrow.upper(), font=eyebrow_font, fill=GOLD)
    y = 370
    for line in wrap(draw, title, title_font, 1420):
        draw.text((120, y), line, font=title_font, fill=IVORY)
        y += 86

    y += 18
    for line in wrap(draw, subtitle, subtitle_font, 1340):
        draw.text((120, y), line, font=subtitle_font, fill=MINT)
        y += 46

    if closing:
        draw.rounded_rectangle((120, 760, 705, 846), radius=14, fill=TEAL)
        draw.text((160, 783), "Continue in the Learning Centre", font=font(bold, 26), fill=WHITE)

    draw.line((120, 930, 1800, 930), fill="#3D5966", width=2)
    for index, line in enumerate(wrap(draw, disclaimer, footer_font, 1650)[:2]):
        draw.text((120, 958 + index * 28), line, font=footer_font, fill=MUTED)

    canvas.convert("RGB").save(output, quality=95)


def make_scene(
    output: Path,
    source: Path,
    logo_path: Path,
    heading: str,
    body: str,
    label: str,
    step: int,
    total_steps: int,
    disclaimer: str,
) -> None:
    screenshot = Image.open(source).convert("RGB").resize((1920, 1080), Image.Resampling.LANCZOS)
    screenshot = ImageEnhance.Contrast(screenshot).enhance(0.96)
    screenshot = ImageEnhance.Brightness(screenshot).enhance(0.88).convert("RGBA")
    canvas = screenshot.copy()
    draw = ImageDraw.Draw(canvas, "RGBA")
    bold = "C:/Windows/Fonts/seguisb.ttf"
    regular = "C:/Windows/Fonts/segoeui.ttf"

    panel_on_left = step % 2 == 1
    panel_left = 72 if panel_on_left else 1038
    panel_right = panel_left + 810
    draw.rounded_rectangle(
        (panel_left, 116, panel_right, 920),
        radius=30,
        fill=(11, 43, 60, 239),
        outline=(199, 216, 211, 80),
        width=2,
    )
    draw.rectangle((panel_left, 116, panel_left + 10, 920), fill=TEAL)
    draw.rectangle((panel_left + 10, 116, panel_left + 14, 920), fill=GOLD)

    text_x = panel_left + 60
    draw_logo(canvas, logo_path, text_x, 164, 228)
    draw.text((text_x, 300), label.upper(), font=font(bold, 20), fill=GOLD)
    draw.text((panel_right - 130, 300), f"{step:02}/{total_steps:02}", font=font(bold, 20), fill=MINT)

    y = 355
    for line in wrap(draw, heading, font(bold, 48), 680)[:3]:
        draw.text((text_x, y), line, font=font(bold, 48), fill=IVORY)
        y += 60

    y += 30
    for line in wrap(draw, body, font(regular, 31), 680)[:6]:
        draw.text((text_x, y), line, font=font(regular, 31), fill=MINT)
        y += 43

    draw.rounded_rectangle((text_x, 814, text_x + 235, 862), radius=24, fill=(11, 138, 114, 255))
    draw.text((text_x + 26, 826), "English subtitles included", font=font(bold, 17), fill=WHITE)

    draw.rounded_rectangle((72, 955, 1848, 1028), radius=18, fill=(11, 43, 60, 224))
    footer = wrap(draw, disclaimer, font(regular, 16), 1680)[0]
    draw.text((112, 980), footer, font=font(regular, 16), fill=MUTED)
    canvas.convert("RGB").save(output, quality=95)


def make_poster(output: Path, source: Path, logo_path: Path, title: str, subtitle: str) -> None:
    source_image = Image.open(source).convert("RGB").resize((1920, 1080), Image.Resampling.LANCZOS)
    source_image = source_image.filter(ImageFilter.GaussianBlur(radius=1.4))
    source_image = ImageEnhance.Brightness(source_image).enhance(0.50).convert("RGBA")
    overlay = Image.new("RGBA", source_image.size, (11, 43, 60, 92))
    canvas = Image.alpha_composite(source_image, overlay)
    draw = ImageDraw.Draw(canvas)
    bold = "C:/Windows/Fonts/seguisb.ttf"
    regular = "C:/Windows/Fonts/segoeui.ttf"
    draw_logo(canvas, logo_path, 100, 78, 290)
    draw.rounded_rectangle((100, 365, 1820, 870), radius=28, fill=(11, 43, 60, 226), outline=(199, 216, 211, 80), width=2)
    draw.text((150, 425), "SILENT · SUBTITLED VIDEO GUIDE", font=font(bold, 23), fill=GOLD)
    y = 485
    for line in wrap(draw, title, font(bold, 62), 1460):
        draw.text((150, y), line, font=font(bold, 62), fill=IVORY)
        y += 74
    for line in wrap(draw, subtitle, font(regular, 29), 1400)[:2]:
        draw.text((150, y + 20), line, font=font(regular, 29), fill=MINT)
        y += 40
    draw.ellipse((1618, 585, 1768, 735), fill=TEAL)
    draw.polygon([(1678, 625), (1678, 695), (1734, 660)], fill=WHITE)
    canvas.convert("RGB").save(output, quality=92, optimize=True)


def seconds_to_timestamp(value: float) -> str:
    milliseconds = int(round(value * 1000))
    hours, milliseconds = divmod(milliseconds, 3_600_000)
    minutes, milliseconds = divmod(milliseconds, 60_000)
    seconds, milliseconds = divmod(milliseconds, 1000)
    return f"{hours:02}:{minutes:02}:{seconds:02}.{milliseconds:03}"


def write_captions(beats: list[dict], start_at: float, beat_duration: float, vtt_path: Path) -> None:
    cues: list[str] = []
    for index, beat in enumerate(beats):
        start = start_at + index * beat_duration
        end = start + beat_duration - 0.08
        cues.append(
            f"{seconds_to_timestamp(start)} --> {seconds_to_timestamp(end)}\n"
            f"{beat['heading']}. {beat['body']}"
        )
    vtt_path.write_text("WEBVTT\n\n" + "\n\n".join(cues) + "\n", encoding="utf-8")


def render_video(
    ffmpeg: Path,
    video: dict,
    disclaimer: str,
    stills: Path,
    output_dir: Path,
    work_dir: Path,
    logo_path: Path,
) -> None:
    slug = video["slug"]
    target_duration = float(video["target_duration"])
    beats = video["beats"]
    title_duration = 4.0
    closing_duration = 3.0
    beat_duration = (target_duration - title_duration - closing_duration) / len(beats)

    video_work = work_dir / slug
    video_work.mkdir(parents=True, exist_ok=True)
    title_card = video_work / "title.png"
    end_card = video_work / "end.png"
    poster = output_dir / "posters" / f"{slug}.jpg"
    vtt = output_dir / f"{slug}.vtt"

    make_card(title_card, logo_path, video["title"], video["subtitle"], video["audience"], disclaimer)
    make_card(
        end_card,
        logo_path,
        video.get("closing_title", "Real assets. Clear rights. Ethical access."),
        video.get("closing_subtitle", "Continue your role-specific journey in Mizant."),
        "Mizant Learning Centre",
        disclaimer,
        closing=True,
    )
    make_poster(poster, stills / f"{beats[0]['image']}.png", logo_path, video["title"], video["subtitle"])

    scene_paths: list[Path] = []
    for index, beat in enumerate(beats, start=1):
        scene_path = video_work / f"scene-{index:02}.png"
        make_scene(
            scene_path,
            stills / f"{beat['image']}.png",
            logo_path,
            beat["heading"],
            beat["body"],
            video["audience"],
            index,
            len(beats),
            disclaimer,
        )
        scene_paths.append(scene_path)

    write_captions(beats, title_duration, beat_duration, vtt)
    concat_file = video_work / "slideshow.txt"
    frames = [(title_card, title_duration)] + [(path, beat_duration) for path in scene_paths] + [(end_card, closing_duration)]
    with concat_file.open("w", encoding="utf-8") as handle:
        for frame, frame_duration in frames:
            escaped = str(frame.resolve()).replace("'", "'\\''")
            handle.write(f"file '{escaped}'\n")
            handle.write(f"duration {frame_duration:.3f}\n")
        escaped = str(frames[-1][0].resolve()).replace("'", "'\\''")
        handle.write(f"file '{escaped}'\n")

    output = output_dir / f"{slug}.mp4"
    fade_out_start = max(0.0, target_duration - 0.6)
    run([
        str(ffmpeg), "-y", "-hide_banner", "-loglevel", "error",
        "-f", "concat", "-safe", "0", "-i", str(concat_file),
        "-vf", f"fps=24,format=yuv420p,fade=t=in:st=0:d=0.45,fade=t=out:st={fade_out_start:.3f}:d=0.55",
        "-t", f"{target_duration:.3f}",
        "-c:v", "libx264", "-preset", "medium", "-crf", "22", "-profile:v", "high", "-level", "4.1",
        "-an", "-movflags", "+faststart", str(output),
    ])
    print(f"{slug}|{target_duration:.1f}s|{output.stat().st_size} bytes|audio=none|captions=webvtt")


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--ffmpeg", required=True, type=Path)
    parser.add_argument("--manifest", required=True, type=Path)
    parser.add_argument("--stills", required=True, type=Path)
    parser.add_argument("--output", required=True, type=Path)
    parser.add_argument("--work", required=True, type=Path)
    parser.add_argument("--logo", required=True, type=Path)
    args = parser.parse_args()

    args.output.mkdir(parents=True, exist_ok=True)
    (args.output / "posters").mkdir(parents=True, exist_ok=True)
    args.work.mkdir(parents=True, exist_ok=True)

    content = json.loads(args.manifest.read_text(encoding="utf-8"))

    for video in content["videos"]:
        render_video(
            args.ffmpeg,
            video,
            content["disclaimer"],
            args.stills,
            args.output,
            args.work,
            args.logo,
        )


if __name__ == "__main__":
    main()
