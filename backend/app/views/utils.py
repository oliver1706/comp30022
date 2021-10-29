from app.models import Department, Organisation
from matplotlib import pyplot as plt
import base64
from io import BytesIO

# If the validated_data contains a department id or a null department, update instance
def update_department_id(instance, validated_data):
    department_id = validated_data.get("department")
    if department_id != None:
        department = Department.objects.get(id = department_id)
        instance.department = department
    elif "department" in validated_data:
        instance.department = None

# If the validated_data contains an organisation id or a null department, update instance
def update_organisation_id(instance, validated_data):
    organisation_id = validated_data.get("organisation")
    if organisation_id != None:
        organisation = Organisation.objects.get(id = organisation_id)
        instance.organisation = organisation
    elif "organisation" in validated_data:
        instance.organisation = None

def get_graph():
    buffer=BytesIO()
    plt.savefig(buffer,format='png')
    buffer.seek(0)
    image_png=buffer.getvalue()
    graph = base64.b64encode(image_png)
    graph=graph.decode('utf-8')
    buffer.close()
    return graph

def get_plot(x,y,title,xlabel,ylabel):
    plt.switch_backend('AGG')
    plt.title(title)
    plt.plot(x, y, marker = 'o')
    plt.xlabel(xlabel)
    plt.ylabel(ylabel)
    graph=get_graph()
    return graph