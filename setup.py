#!/usr/bin/env python
from setuptools import setup,find_packages

"""Setup script for Meta Education XAPI Client."""

version = "0.0.1" # [major].[minor].[release]

# parse README
with open('README.md') as readme_file:
    long_description = readme_file.read()

# parse requirements
with open('xapi/requirements.txt') as f:
    required = f.read().splitlines()

# run setup
setup(
    name='Meta Education XAPI Client',
    version=version,
    description='Crawler and parser for XAPI',
    long_description =long_description,
    author='',
    author_email='clement.renaud@gmail.com',
    download_url='https://github.com/sical/meta-education',
    keywords = ["education", "crawler"],
    packages = find_packages(exclude=['res', 'scripts', 'tests*']),
    install_requires=required,
    entry_points = {
                'console_scripts': [ 'xapi-client=xapi.main:main' ]
                },
    license='BSD',
    zip_safe=False,
    classifiers=[
        'Development Status :: 4 - Beta',
        'Environment :: Console',
        'Intended Audience :: Developers',
        'Natural Language :: English',
        "License :: OSI Approved :: GNU Library or Lesser General Public License (LGPL)",
        'Programming Language :: Python',
        'Programming Language :: Python :: 2.7',
        'Programming Language :: Python :: 3',
        'Topic :: Software Development',
    ]
)
