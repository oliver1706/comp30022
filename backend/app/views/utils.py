from app.models import Department, Organisation
from matplotlib import pyplot as plt
import base64
from io import BytesIO

# If the validated_data contains a department id or a null department, update it
def update_department_id(instance, validated_data):
    department_id = validated_data.get("department")
    if department_id != None:
        department = Department.objects.get(id = department_id)
        instance.department = department
    elif "department" in validated_data:
        instance.department = None

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

def get_plot(x,y):
    plt.switch_backend('AGG')
    plt.figure(figsize=(10,5))
    plt.title('Sales by Date')
    plt.plot(x,y)
    plt.xlabel('Date')
    plt.ylabel('Sum of Sales')
    graph=get_graph()
    return graph